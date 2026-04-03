"""
Скрипт для парсинга данных со старого сайта и импорта в Django
"""
import os
import sys
import django
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time

# Настройка Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
django.setup()

from store.models import Category, Product, Stone

# ============================================
# НАСТРОЙКИ - ИЗМЕНИ ПОД СВОЙ СТАРЫЙ САЙТ
# ============================================

OLD_SITE_URL = "http://твой-старый-сайт.com"  # <-- ИЗМЕНИ!
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

# ============================================


def parse_categories():
    """Парсинг категорий"""
    print("📂 Парсинг категорий...")
    
    # Пример: парсим страницу с категориями
    # ИЗМЕНИ под структуру своего сайта!
    url = urljoin(OLD_SITE_URL, "/categories")
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    categories = []
    
    # Пример: ищем категории в определённом HTML
    # ИЗМЕНИ селекторы под свой сайт!
    for item in soup.select('.category-item'):
        name = item.select_one('.category-name').text.strip()
        link = item.select_one('a')['href']
        
        category, created = Category.objects.get_or_create(
            name=name,
            defaults={'slug': name.lower().replace(' ', '-')}
        )
        
        if created:
            print(f"  ✅ Создана категория: {name}")
        else:
            print(f"  ⏭️  Категория уже есть: {name}")
        
        categories.append(category)
    
    return categories


def parse_products(category=None):
    """Парсинг товаров"""
    print("📦 Парсинг товаров...")
    
    # Пример: парсим страницу с товарами
    # ИЗМЕНИ под структуру своего сайта!
    url = urljoin(OLD_SITE_URL, "/products")
    if category:
        url = urljoin(OLD_SITE_URL, f"/category/{category.slug}")
    
    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    products = []
    
    # Пример: ищем товары в определённом HTML
    # ИЗМЕНИ селекторы под свой сайт!
    for item in soup.select('.product-item'):
        try:
            name = item.select_one('.product-name').text.strip()
            price_text = item.select_one('.product-price').text.strip()
            price = float(price_text.replace('₽', '').replace(' ', '').replace(',', '.'))
            description = item.select_one('.product-description').text.strip() if item.select_one('.product-description') else ""
            image_url = item.select_one('.product-image img')['src']
            image_url = urljoin(OLD_SITE_URL, image_url)
            
            # Создаём товар
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'price': price,
                    'description': description,
                    'category': category,
                }
            )
            
            if created:
                print(f"  ✅ Создан товар: {name} - {price}₽")
                
                # Скачиваем изображение
                if image_url:
                    download_image(product, image_url)
            else:
                print(f"  ⏭️  Товар уже есть: {name}")
            
            products.append(product)
            
            # Пауза чтобы не перегружать сервер
            time.sleep(0.5)
            
        except Exception as e:
            print(f"  ❌ Ошибка при парсинге товара: {e}")
            continue
    
    return products


def download_image(product, image_url):
    """Скачивание изображения товара"""
    try:
        print(f"    📥 Скачиваю изображение: {image_url}")
        response = requests.get(image_url, headers=HEADERS)
        
        if response.status_code == 200:
            # Сохраняем во временный файл
            filename = image_url.split('/')[-1]
            temp_path = f"/tmp/{filename}"
            
            with open(temp_path, 'wb') as f:
                f.write(response.content)
            
            # TODO: Привязать изображение к товару через ProductImage
            # from store.models import ProductImage
            # ProductImage.objects.create(
            #     product=product,
            #     image=File(open(temp_path, 'rb'), name=filename)
            # )
            
            print(f"    ✅ Изображение сохранено")
            
    except Exception as e:
        print(f"    ❌ Ошибка скачивания изображения: {e}")


def parse_product_details(product_url):
    """Парсинг детальной страницы товара"""
    print(f"  🔍 Парсинг деталей: {product_url}")
    
    response = requests.get(product_url, headers=HEADERS)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # ИЗМЕНИ селекторы под свой сайт!
    details = {
        'name': soup.select_one('.product-title').text.strip() if soup.select_one('.product-title') else "",
        'price': soup.select_one('.product-price').text.strip() if soup.select_one('.product-price') else "",
        'description': soup.select_one('.product-description').text.strip() if soup.select_one('.product-description') else "",
        'material': soup.select_one('.product-material').text.strip() if soup.select_one('.product-material') else "",
        'weight': soup.select_one('.product-weight').text.strip() if soup.select_one('.product-weight') else "",
    }
    
    # Парсинг изображений
    images = []
    for img in soup.select('.product-gallery img'):
        img_url = img.get('src') or img.get('data-src')
        if img_url:
            images.append(urljoin(OLD_SITE_URL, img_url))
    
    details['images'] = images
    
    return details


def main():
    print("🚀 Начинаю парсинг старого сайта...")
    print(f"📍 URL: {OLD_SITE_URL}")
    print("=" * 50)
    
    # 1. Парсим категории
    categories = parse_categories()
    print(f"\n✅ Всего категорий: {len(categories)}")
    
    # 2. Парсим товары для каждой категории
    all_products = []
    for category in categories:
        products = parse_products(category)
        all_products.extend(products)
    
    print(f"\n✅ Всего товаров: {len(all_products)}")
    print("\n🎉 Парсинг завершён!")


if __name__ == '__main__':
    main()
