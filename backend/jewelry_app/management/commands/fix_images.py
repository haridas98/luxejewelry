"""
Скрипт для сопоставления товаров с изображениями
Изображения находятся в backend/media/products/{category}/LUX-XXXXXX/1.png
Сопоставляем по категории и LUX-коду
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_store.settings')
django.setup()

from jewelry_app.models import Product, ProductImage, Category
from django.core.files.images import ImageFile


def get_image_path(category_slug, lux_code):
    """Получаем путь к изображению"""
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'products')
    
    # Пробуем разные варианты расширения
    for ext in ['png', 'jpg', 'jpeg', 'webp']:
        path = os.path.join(base, category_slug, lux_code, f'1.{ext}')
        if os.path.exists(path):
            return path, f'products/{category_slug}/{lux_code}/1.{ext}'
    return None, None


def fix_products():
    """Исправляем товары: добавляем article и изображения"""
    
    # Создаём словарь категорий
    categories = {cat.name: cat for cat in Category.objects.all()}
    category_slugs = {
        'Кольца': 'rings',
        'Серьги': 'earrings',
        'Браслеты': 'bracelets',
        'Кулоны': 'pendants',
        'Цепочки': 'chains',
        'Ожерелья': 'necklaces',
        'Наборы': 'sets',
        'Другое': 'other',
    }
    
    products = Product.objects.all()
    updated = 0
    with_images = 0
    errors = 0
    
    for product in products:
        # Определяем категорию
        if isinstance(product.category, Category):
            cat_name = product.category.name
        else:
            try:
                cat = Category.objects.get(id=product.category)
                cat_name = cat.name
            except Category.DoesNotExist:
                print(f"⚠️  Продукт {product.id}: категория не найдена")
                continue
        
        cat_slug = category_slugs.get(cat_name)
        if not cat_slug:
            print(f"⚠️  Продукт {product.id} ({product.name}): нет slug для категории '{cat_name}'")
            continue
        
        # Получаем article из существующих данных или генерируем
        article = product.article
        
        # Ищем изображения
        img_path, img_relative = get_image_path(cat_slug, f'LUX-{product.id:08X}' if not article else article.replace('LUX-', ''))
        
        # Если article пустой или нет, пробуем найти по ID
        if not article or article == '':
            # Используем hex ID как временный LUX-код
            lux_code = f'{product.id:08X}'
            img_path, img_relative = get_image_path(cat_slug, lux_code)
            
            if img_path:
                article = f'LUX-{lux_code}'
                product.article = article
                product.save(update_fields=['article'])
                print(f"✅ Продукт {product.id}: article={article}")
        
        # Если всё ещё нет изображения, пробуем найти любую папку LUX-* в категории
        if not img_path:
            products_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'products', cat_slug)
            if os.path.exists(products_dir):
                for folder in os.listdir(products_dir):
                    if folder.startswith('LUX-'):
                        # Проверяем, есть ли уже изображение у этого продукта
                        existing_imgs = ProductImage.objects.filter(product=product)
                        if not existing_imgs.exists():
                            img_path_candidate = os.path.join(products_dir, folder, '1.png')
                            if not os.path.exists(img_path_candidate):
                                img_path_candidate = os.path.join(products_dir, folder, '1.jpg')
                            if os.path.exists(img_path_candidate):
                                img_path = img_path_candidate
                                img_relative = f'products/{cat_slug}/{folder}/1.{"png" if img_path_candidate.endswith(".png") else "jpg"}'
                                article = folder  # LUX-XXXXXX
                                product.article = article
                                product.save(update_fields=['article'])
                                print(f"✅ Продукт {product.id}: article={article}, image found")
                                break
        
        # Создаём ProductImage
        if img_path and os.path.exists(img_path):
            try:
                # Проверяем, нет ли уже изображения
                existing = ProductImage.objects.filter(product=product).exists()
                if not existing:
                    img = ProductImage(
                        product=product,
                        image=img_relative,
                        image_url=f'/media/{img_relative}',
                        is_primary=True,
                        sort_order=0
                    )
                    img.save()
                    with_images += 1
                    print(f"  🖼️  Добавлено изображение: {img_relative}")
                else:
                    # Обновляем существующее
                    existing_img = ProductImage.objects.filter(product=product).first()
                    if existing_img.image != img_relative:
                        existing_img.image = img_relative
                        existing_img.image_url = f'/media/{img_relative}'
                        existing_img.save(update_fields=['image', 'image_url'])
                        print(f"  🔄 Обновлено изображение: {img_relative}")
            except Exception as e:
                print(f"  ❌ Ошибка сохранения изображения: {e}")
                errors += 1
        
        updated += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Обновлено товаров: {updated}")
    print(f"🖼️  Добавлено изображений: {with_images}")
    print(f"❌ Ошибок: {errors}")


if __name__ == '__main__':
    fix_products()
