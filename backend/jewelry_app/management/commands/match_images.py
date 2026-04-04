"""
Скрипт сопоставляет изображения из backend/media/products/{category}/LUX-XXXXXX/
с товарами в БД и обновляет article + ProductImage
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
django.setup()

from jewelry_app.models import Product, ProductImage, Category

# Маппинг категорий
CATEGORY_SLUG_MAP = {
    'Кольца': 'rings',
    'Серьги': 'earrings', 
    'Браслеты': 'bracelets',
    'Кулоны': 'pendants',
    'Цепочки': 'chains',
    'Ожерелья': 'necklaces',
    'Наборы': 'sets',
    'Другое': 'other',
}

MEDIA_BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'products')


def main():
    # 1. Сканируем все изображения
    image_map = {}  # {lux_code: (category_name, relative_path)}
    
    if not os.path.exists(MEDIA_BASE):
        print(f"❌ Папка не найдена: {MEDIA_BASE}")
        return
    
    for cat_folder in os.listdir(MEDIA_BASE):
        cat_path = os.path.join(MEDIA_BASE, cat_folder)
        if not os.path.isdir(cat_path):
            continue
        
        for lux_folder in os.listdir(cat_path):
            if not lux_folder.startswith('LUX-'):
                continue
            
            # Ищем изображение
            img_file = None
            for ext in ['png', 'jpg', 'jpeg', 'webp']:
                candidate = os.path.join(cat_path, lux_folder, f'1.{ext}')
                if os.path.exists(candidate):
                    img_file = f'1.{ext}'
                    break
            
            if img_file:
                relative = f'products/{cat_folder}/{lux_folder}/{img_file}'
                # Находим название категории по slug
                cat_name = None
                for name, slug in CATEGORY_SLUG_MAP.items():
                    if slug == cat_folder:
                        cat_name = name
                        break
                
                image_map[lux_folder] = (cat_name, relative)
    
    print(f"📁 Найдено папок с изображениями: {len(image_map)}")
    
    # 2. Получаем все товары
    products = Product.objects.all()
    print(f"📦 Всего товаров в БД: {products.count()}")
    
    # 3. Сопоставляем
    updated_articles = 0
    added_images = 0
    skipped = 0
    
    for product in products:
        # Определяем категорию товара
        if isinstance(product.category_id, int):
            try:
                cat = Category.objects.get(id=product.category_id)
                cat_name = cat.name
            except Category.DoesNotExist:
                continue
        else:
            cat_name = str(product.category)
        
        expected_slug = CATEGORY_SLUG_MAP.get(cat_name)
        if not expected_slug:
            continue
        
        # Ищем LUX-код в этой категории
        found_lux = None
        found_relative = None
        
        for lux_code, (img_cat_name, rel_path) in image_map.items():
            if img_cat_name == cat_name:
                # Проверяем, не использован ли уже этот LUX-код
                if not Product.objects.filter(article=lux_code).exclude(id=product.id).exists():
                    found_lux = lux_code
                    found_relative = rel_path
                    break
        
        if found_lux:
            # Обновляем article
            if product.article != found_lux:
                product.article = found_lux
                product.save(update_fields=['article'])
                updated_articles += 1
                print(f"✅ {product.name[:40]:<40} article={found_lux}")
            
            # Добавляем изображение
            if not ProductImage.objects.filter(product=product).exists():
                ProductImage.objects.create(
                    product=product,
                    image=found_relative,
                    image_url=f'/media/{found_relative}',
                    is_primary=True,
                    sort_order=0
                )
                added_images += 1
                print(f"  🖼️  {found_relative}")
            
            # Удаляем из image_map чтобы не использовать повторно
            del image_map[found_lux]
        else:
            skipped += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Обновлено article: {updated_articles}")
    print(f"🖼️  Добавлено изображений: {added_images}")
    print(f"⏭️  Пропущено (нет подходящих изображений): {skipped}")
    print(f"📁 Осталось неиспользованных изображений: {len(image_map)}")


if __name__ == '__main__':
    main()
