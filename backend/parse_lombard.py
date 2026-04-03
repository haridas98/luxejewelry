"""
Скрипт для парсинга данных с lombard-exclusive.ru и импорта в Django
"""
import os
import sys
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
import re

# Настройка Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
django.setup()

from store.models import Category, Product, Stone

# ============================================
# НАСТРОЙКИ
# ============================================

BASE_URL = "https://lombard-exclusive.ru"
CATEGORY_URL = f"{BASE_URL}/product-category/yuvelirnye-izdeliya/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

# ============================================


def get_soup(url):
    """Получить BeautifulSoup объект"""
    print(f"  🌐 Загружаю: {url}")
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return BeautifulSoup(response.text, 'html.parser')


def parse_categories():
    """Создаём категории вручную (бренды)"""
    print("📂 Создаю категории...")
    
    categories_data = [
        ("Кольца", "rings"),
        ("Серьги", "earrings"),
        ("Браслеты", "bracelets"),
        ("Кулоны", "pendants"),
        ("Колье", "necklaces"),
        ("Наборы", "sets"),
        ("Цепочки", "chains"),
    ]
    
    categories = {}
    for name, slug in categories_data:
        category, created = Category.objects.get_or_create(
            name=name,
            defaults={'slug': slug}
        )
        categories[name] = category
        if created:
            print(f"  ✅ Создана: {name}")
        else:
            print(f"  ⏭️  Уже есть: {name}")
    
    return categories


def determine_category(product_name):
    """Определяем категорию по названию товара"""
    name_lower = product_name.lower()
    
    if any(word in name_lower for word in ['кольцо', 'ring', 'baque']):
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
        return "Кольца"  # По умолчанию


def extract_price_rub(price_text):
    """Извлекаем цену в рублях"""
    # Ищем цену с ₽
    match = re.search(r'([\d\s]+)\s*₽', price_text)
    if match:
        price_str = match.group(1).replace(' ', '').replace(',', '.')
        try:
            return float(price_str)
        except ValueError:
            return 0
    return 0


def parse_products_page(soup, categories):
    """Парсим товары со страницы каталога"""
    products = []
    
    # Ищем карточки товаров (WooCommerce структура)
    product_cards = soup.select('li.product, .product-card, article.product')
    
    if not product_cards:
        # Пробуем другие селекторы
        product_cards = soup.select('.products li, .product-grid article, .woocommerce-loop-product__link')
    
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
            image_url = img_elem['src'] if img_elem else None
            if image_url:
                image_url = urljoin(BASE_URL, image_url)
            
            # Бренд
            brand = "No name"
            brand_elem = card.select_one('.product-brand, .brand')
            if brand_elem:
                brand = brand_elem.get_text(strip=True)
            
            # Определяем категорию
            category_name = determine_category(name)
            category = categories.get(category_name)
            
            product_data = {
                'name': name,
                'price': price_rub,
                'category': category,
                'brand': brand,
                'product_url': product_url,
                'image_url': image_url,
            }
            
            products.append(product_data)
            print(f"    ✅ {name[:50]}... - {price_rub}₽")
            
        except Exception as e:
            print(f"    ❌ Ошибка парсинга карточки: {e}")
            continue
    
    return products


def parse_product_details(product_url):
    """Парсим детальную страницу товара"""
    try:
        soup = get_soup(product_url)
        
        details = {}
        
        # Описание
        desc_elem = soup.select_one('.woocommerce-product-details__short-description, .product-description, .entry-content')
        if desc_elem:
            details['description'] = desc_elem.get_text(strip=True)[:500]
        
        # Дополнительные изображения
        images = []
        for img in soup.select('.woocommerce-product-gallery__image img, .product-gallery img, .thumbnails img'):
            img_src = img.get('src') or img.get('data-src')
            if img_src:
                images.append(urljoin(BASE_URL, img_src))
        
        details['images'] = images
        
        return details
        
    except Exception as e:
        print(f"    ❌ Ошибка парсинга деталей: {e}")
        return {}


def save_product(product_data):
    """Сохраняем товар в базу"""
    try:
        # Проверяем дубликаты по названию
        if Product.objects.filter(name=product_data['name']).exists():
            print(f"    ⏭️  Уже есть: {product_data['name'][:50]}")
            return None
        
        product = Product.objects.create(
            name=product_data['name'],
            price=product_data['price'],
            category=product_data['category'],
            description=product_data.get('description', ''),
            is_featured=False,
            is_available=True,
        )
        
        print(f"    ✅ Создан: {product.name[:50]}... - {product.price}₽")
        
        return product
        
    except Exception as e:
        print(f"    ❌ Ошибка сохранения: {e}")
        return None


def parse_all_pages(categories):
    """Парсим все страницы каталога"""
    all_products = []
    page = 1
    
    while True:
        if page == 1:
            url = CATEGORY_URL
        else:
            url = f"{CATEGORY_URL}page/{page}/"
        
        print(f"\n📄 Страница {page}")
        
        try:
            soup = get_soup(url)
        except Exception as e:
            print(f"  ❌ Ошибка загрузки страницы: {e}")
            break
        
        products = parse_products_page(soup, categories)
        
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
        time.sleep(1)  # Пауза между страницами
    
    return all_products


def main():
    print("🚀 Парсинг lombard-exclusive.ru")
    print("=" * 60)
    
    # 1. Создаём категории
    categories = parse_categories()
    
    # 2. Парсим все товары
    print("\n📦 Парсинг товаров...")
    all_products = parse_all_pages(categories)
    
    print(f"\n{'=' * 60}")
    print(f"✅ Всего найдено товаров: {len(all_products)}")
    
    # 3. Сохраняем в базу
    print("\n💾 Сохранение в базу данных...")
    saved_count = 0
    
    for product_data in all_products:
        # Парсим детальную страницу (опционально, медленно)
        if product_data.get('product_url'):
            details = parse_product_details(product_data['product_url'])
            product_data.update(details)
            time.sleep(0.5)  # Пауза
        
        product = save_product(product_data)
        if product:
            saved_count += 1
    
    print(f"\n{'=' * 60}")
    print(f"🎉 Готово! Сохранено товаров: {saved_count}")


if __name__ == '__main__':
    main()
