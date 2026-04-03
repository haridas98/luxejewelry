"""
Скрипт для парсинга данных с lombard-exclusive.ru и импорта в Django
Сохраняет данные в JSON, SQL и скачивает изображения
"""
import os
import sys
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from io import BytesIO
import json
import time
import re
from datetime import datetime

# Настройка Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
django.setup()

from jewelry_app.models import Brand, Category, Subcategory, Product, ProductImage, Stone

# ============================================
# НАСТРОЙКИ
# ============================================

BASE_URL = "https://lombard-exclusive.ru"
CATEGORY_URL = f"{BASE_URL}/product-category/yuvelirnye-izdeliya/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# Папка для сохранения изображений
IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'product_images')
os.makedirs(IMAGES_DIR, exist_ok=True)

# Папка для экспорта
EXPORT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'exports')
os.makedirs(EXPORT_DIR, exist_ok=True)

# ============================================


def get_soup(url):
    """Получить BeautifulSoup объект"""
    print(f"  🌐 Загружаю: {url}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"  ❌ Ошибка загрузки: {e}")
        return None


def extract_price_rub(price_text):
    """Извлекаем цену в рублях"""
    if not price_text:
        return 0
    match = re.search(r'([\d\s]+)\s*₽', price_text)
    if match:
        price_str = match.group(1).replace(' ', '').replace(',', '.')
        try:
            return float(price_str)
        except ValueError:
            return 0
    return 0


def extract_reference(text):
    """Извлекаем референс (артикул) из текста"""
    if not text:
        return ""
    # Ищем паттерны типа REF: XXX, Артикул: XXX, Reference: XXX
    match = re.search(r'(?:REF|Reference|Референс|Артикул|REF\.?)\s*[:#]?\s*([A-Z0-9\-]+)', text, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""


def determine_category(product_name):
    """Определяем категорию по названию товара"""
    name_lower = product_name.lower()
    
    if any(word in name_lower for word in ['кольцо', 'ring', 'bague']):
        return "Кольца"
    elif any(word in name_lower for word in ['серег', 'earring', 'пусет', 'stud']):
        return "Серьги"
    elif any(word in name_lower for word in ['браслет', 'bracelet']):
        return "Браслеты"
    elif any(word in name_lower for word in ['кулон', 'pendant']):
        return "Кулоны"
    elif any(word in name_lower for word in ['колье', 'necklace']):
        return "Колье"
    elif any(word in name_lower for word in ['сет', 'set']):
        return "Наборы"
    elif any(word in name_lower for word in ['цепоч', 'chain']):
        return "Цепочки"
    else:
        return "Кольца"


def get_or_create_brand(brand_name):
    """Создаём или получаем бренд"""
    if not brand_name or brand_name.lower() in ['no name', 'без бренда', 'unknown']:
        return None
    
    brand, created = Brand.objects.get_or_create(
        name=brand_name.strip(),
        defaults={'is_active': True}
    )
    
    if created:
        print(f"    🏷️  Создан бренд: {brand_name}")
    
    return brand


def download_image(image_url, product_name):
    """Скачиваем изображение и сохраняем локально"""
    if not image_url:
        return None
    
    try:
        print(f"    📥 Скачиваю: {image_url[:60]}...")
        response = requests.get(image_url, headers=HEADERS, timeout=30)
        
        if response.status_code == 200:
            # Генерируем имя файла
            ext = image_url.split('.')[-1].split('?')[0]
            if ext not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                ext = 'jpg'
            
            safe_name = re.sub(r'[^\w\s-]', '', product_name)[:50].strip().replace(' ', '_')
            filename = f"{safe_name}_{int(time.time())}.{ext}"
            filepath = os.path.join(IMAGES_DIR, filename)
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"    ✅ Сохранено: {filename}")
            return filepath
        
    except Exception as e:
        print(f"    ❌ Ошибка скачивания: {e}")
    
    return None


def parse_product_details(product_url):
    """Парсим детальную страницу товара"""
    details = {
        'description': '',
        'reference': '',
        'images': [],
        'material': '',
        'weight': '',
    }
    
    soup = get_soup(product_url)
    if not soup:
        return details
    
    try:
        # Описание
        desc_elem = soup.select_one('.woocommerce-product-details__short-description, .product-description, .entry-content, .summary .woocommerce-product-details__short-description')
        if desc_elem:
            details['description'] = desc_elem.get_text(strip=True)[:1000]
        
        # Референс/артикул из описания или характеристик
        ref_elem = soup.select_one('.product-reference, .reference, .sku, .product-meta')
        if ref_elem:
            details['reference'] = extract_reference(ref_elem.get_text())
        
        # Если не нашли в отдельном поле, ищем в описании
        if not details['reference'] and details['description']:
            details['reference'] = extract_reference(details['description'])
        
        # Изображения
        for img in soup.select('.woocommerce-product-gallery__image img, .product-gallery img, .thumbnails img, .zoomImg'):
            img_src = img.get('src') or img.get('data-src') or img.get('data-large_image')
            if img_src:
                details['images'].append(urljoin(BASE_URL, img_src))
        
        # Если нет изображений в галерее, берём главное
        if not details['images']:
            main_img = soup.select_one('.woocommerce-product-gallery__wrapper img, .product-image img')
            if main_img:
                img_src = main_img.get('src') or main_img.get('data-src')
                if img_src:
                    details['images'].append(urljoin(BASE_URL, img_src))
        
        # Материал и вес из характеристик
        specs = soup.select('.woocommerce-product-attributes tr')
        for spec in specs:
            label = spec.select_one('th')
            value = spec.select_one('td')
            if label and value:
                label_text = label.get_text(strip=True).lower()
                value_text = value.get_text(strip=True)
                
                if 'материал' in label_text or 'material' in label_text:
                    details['material'] = value_text
                elif 'вес' in label_text or 'weight' in label_text:
                    details['weight'] = value_text
        
    except Exception as e:
        print(f"    ❌ Ошибка парсинга деталей: {e}")
    
    return details


def parse_products_page(soup):
    """Парсим товары со страницы каталога"""
    products = []
    
    # Ищем карточки товаров (WooCommerce структура)
    product_cards = soup.select('li.product, .product-card, article.product, .product-grid li')
    
    if not product_cards:
        product_cards = soup.select('.products li, .woocommerce-loop-product__link')
    
    print(f"  📦 Найдено товаров на странице: {len(product_cards)}")
    
    for card in product_cards:
        try:
            # Название
            name_elem = card.select_one('h2, .woocommerce-loop-product__title, .product-title, h3')
            if not name_elem:
                continue
            name = name_elem.get_text(strip=True)
            
            if not name or len(name) < 3:
                continue
            
            # Цена
            price_elem = card.select_one('.price, .woocommerce-Price-amount, .product-price')
            price_rub = 0
            if price_elem:
                price_rub = extract_price_rub(price_elem.get_text())
            
            # Ссылка на товар
            link_elem = card.select_one('a[href*="/product/"]')
            product_url = link_elem['href'] if link_elem else None
            
            # Изображение
            img_elem = card.select_one('img')
            image_url = None
            if img_elem:
                image_url = img_elem.get('src') or img_elem.get('data-src')
                if image_url:
                    image_url = urljoin(BASE_URL, image_url)
            
            # Бренд
            brand_name = "No name"
            brand_elem = card.select_one('.product-brand, .brand, .product-brand-name')
            if brand_elem:
                brand_name = brand_elem.get_text(strip=True)
            
            product_data = {
                'name': name,
                'price': price_rub,
                'brand_name': brand_name,
                'product_url': product_url,
                'image_url': image_url,
            }
            
            products.append(product_data)
            print(f"    ✅ {name[:50]}... - {price_rub}₽")
            
        except Exception as e:
            print(f"    ❌ Ошибка парсинга карточки: {e}")
            continue
    
    return products


def save_product(product_data, all_data):
    """Сохраняем товар в базу и в JSON"""
    try:
        # Проверяем дубликаты по названию
        if Product.objects.filter(name=product_data['name']).exists():
            print(f"    ⏭️  Уже есть: {product_data['name'][:50]}")
            return None
        
        # Создаём бренд
        brand = get_or_create_brand(product_data.get('brand_name'))
        
        # Определяем категорию
        category_name = determine_category(product_data['name'])
        category, _ = Category.objects.get_or_create(name=category_name)
        
        # Создаём товар
        product = Product.objects.create(
            name=product_data['name'],
            price=product_data['price'],
            brand=brand,
            category=category,
            description=product_data.get('description', '')[:500],
            reference=product_data.get('reference', ''),
            is_active=True,
            is_out_of_stock=False,
        )
        
        print(f"    ✅ Создан: {product.name[:50]}... - {product.price}₽")
        
        # Сохраняем в JSON для экспорта
        product_json = {
            'name': product.name,
            'price': str(product.price),
            'brand': brand.name if brand else None,
            'category': category.name,
            'description': product.description,
            'reference': product.reference,
            'images': product_data.get('images', []),
        }
        all_data['products'].append(product_json)
        
        return product
        
    except Exception as e:
        print(f"    ❌ Ошибка сохранения: {e}")
        import traceback
        traceback.print_exc()
        return None


def save_image_to_product(product, image_path, is_primary=True):
    """Привязываем скачанное изображение к товару"""
    if not image_path or not os.path.exists(image_path):
        return
    
    try:
        filename = os.path.basename(image_path)
        
        product_image = ProductImage.objects.create(
            product=product,
            image_url=f"/media/product_images/{filename}",
            is_primary=is_primary,
        )
        
        # Также копируем файл в Django media
        with open(image_path, 'rb') as f:
            product_image.image.save(filename, File(f), save=True)
        
        print(f"    🖼️  Изображение привязано: {filename}")
        
    except Exception as e:
        print(f"    ❌ Ошибка привязки изображения: {e}")


def export_to_json(all_data):
    """Экспорт в JSON"""
    filepath = os.path.join(EXPORT_DIR, f'lombard_products_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)
    
    print(f"\n📄 JSON сохранён: {filepath}")
    return filepath


def export_to_sql(all_data):
    """Экспорт в SQL формат (Django fixtures)"""
    filepath = os.path.join(EXPORT_DIR, f'lombard_products_{datetime.now().strftime("%Y%m%d_%H%M%S")}.sql')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write("-- SQL экспорт данных с lombard-exclusive.ru\n")
        f.write(f"-- Дата: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        
        # Бренды
        f.write("-- Бренды\n")
        brands = set()
        for product in all_data['products']:
            if product['brand']:
                brands.add(product['brand'])
        
        for brand in sorted(brands):
            f.write(f"INSERT INTO jewelry_app_brand (name, slug, is_active, created_at) VALUES ('{brand}', '{brand.lower().replace(' ', '-')}', 1, NOW()) ON CONFLICT (name) DO NOTHING;\n")
        
        f.write("\n-- Категории\n")
        categories = set()
        for product in all_data['products']:
            categories.add(product['category'])
        
        for category in sorted(categories):
            f.write(f"INSERT INTO jewelry_app_category (name, created_at, updated_at) VALUES ('{category}', NOW(), NOW()) ON CONFLICT (name) DO NOTHING;\n")
        
        f.write("\n-- Товары\n")
        for product in all_data['products']:
            brand_id = f"(SELECT id FROM jewelry_app_brand WHERE name='{product['brand']}')" if product['brand'] else 'NULL'
            category_id = f"(SELECT id FROM jewelry_app_category WHERE name='{product['category']}')"
            
            desc = product['description'].replace("'", "''")[:500]
            name = product['name'].replace("'", "''")
            ref = product.get('reference', '').replace("'", "''")
            
            f.write(f"INSERT INTO jewelry_app_product (name, description, price, brand_id, category_id, reference, is_active, is_out_of_stock, created_at, updated_at) VALUES ('{name}', '{desc}', {product['price']}, {brand_id}, {category_id}, '{ref}', 1, 0, NOW(), NOW());\n")
    
    print(f"📄 SQL сохранён: {filepath}")
    return filepath


def main():
    print("🚀 Парсинг lombard-exclusive.ru")
    print("=" * 60)
    
    all_data = {
        'brands': [],
        'categories': [],
        'products': [],
        'parsed_at': datetime.now().isoformat(),
    }
    
    # 1. Создаём категории
    print("\n📂 Создаю категории...")
    categories_data = [
        ("Кольца", "rings"),
        ("Серьги", "earrings"),
        ("Браслеты", "bracelets"),
        ("Кулоны", "pendants"),
        ("Колье", "necklaces"),
        ("Наборы", "sets"),
        ("Цепочки", "chains"),
    ]
    
    for name, slug in categories_data:
        category, created = Category.objects.get_or_create(name=name, defaults={'slug': slug})
        all_data['categories'].append({'name': name, 'slug': slug})
        if created:
            print(f"  ✅ Создана: {name}")
        else:
            print(f"  ⏭️  Уже есть: {name}")
    
    # 2. Парсим все страницы
    print("\n📦 Парсинг товаров...")
    all_products = []
    page = 1
    
    while True:
        if page == 1:
            url = CATEGORY_URL
        else:
            url = f"{CATEGORY_URL}page/{page}/"
        
        print(f"\n📄 Страница {page}")
        
        soup = get_soup(url)
        if not soup:
            break
        
        products = parse_products_page(soup)
        
        if not products:
            print("  🏁 Больше товаров нет")
            break
        
        all_products.extend(products)
        
        # Проверяем есть ли следующая страница
        next_link = soup.select_one('a.next.page-numbers, .pagination .next')
        if not next_link:
            print("  🏁 Последняя страница")
            break
        
        page += 1
        time.sleep(1)
    
    print(f"\n{'=' * 60}")
    print(f"✅ Всего найдено товаров: {len(all_products)}")
    
    # 3. Парсим детали и сохраняем
    print("\n🔍 Парсинг деталей и сохранение...")
    saved_count = 0
    
    for i, product_data in enumerate(all_products):
        print(f"\n[{i+1}/{len(all_products)}] {product_data['name'][:50]}...")
        
        # Парсим детальную страницу
        if product_data.get('product_url'):
            details = parse_product_details(product_data['product_url'])
            product_data.update(details)
            time.sleep(0.5)
        
        # Сохраняем в базу
        product = save_product(product_data, all_data)
        
        if product:
            saved_count += 1
            
            # Скачиваем главное изображение
            if product_data.get('image_url'):
                img_path = download_image(product_data['image_url'], product.name)
                if img_path:
                    save_image_to_product(product, img_path, is_primary=True)
            
            # Скачиваем дополнительные изображения
            for j, img_url in enumerate(product_data.get('images', [])):
                if j == 0 and product_data.get('image_url'):
                    continue  # Главное уже скачали
                img_path = download_image(img_url, f"{product.name}_{j}")
                if img_path:
                    save_image_to_product(product, img_path, is_primary=False)
        
        time.sleep(0.3)  # Пауза между товарами
    
    # 4. Экспорт
    print(f"\n{'=' * 60}")
    print(f"🎉 Сохранено товаров: {saved_count}")
    
    print("\n💾 Экспорт данных...")
    json_path = export_to_json(all_data)
    sql_path = export_to_sql(all_data)
    
    print(f"\n{'=' * 60}")
    print("📊 ИТОГИ:")
    print(f"  ✅ Товаров сохранено: {saved_count}")
    print(f"  📄 JSON: {json_path}")
    print(f"  📄 SQL: {sql_path}")
    print(f"  🖼️  Изображения: {IMAGES_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
