import sys; sys.path.insert(0, '.')
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'jewelry_store.settings'
import django
django.setup()

from jewelry_app.models import Product, ProductImage, Category
import glob

# Маппинг категорий
CATEGORY_SLUG_MAP = {
    'Кольца': 'rings', 'Серьги': 'earrings', 'Браслеты': 'bracelets',
    'Кулоны': 'pendants', 'Цепочки': 'chains', 'Ожерелья': 'necklaces',
    'Наборы': 'sets', 'Другое': 'other',
}
REVERSE_SLUG_MAP = {v: k for k, v in CATEGORY_SLUG_MAP.items()}

MEDIA_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'media', 'products')

# 1. Сканируем изображения
image_map = {}
if os.path.exists(MEDIA_BASE):
    for cat_folder in os.listdir(MEDIA_BASE):
        cat_path = os.path.join(MEDIA_BASE, cat_folder)
        if not os.path.isdir(cat_path): continue
        for lux_folder in os.listdir(cat_path):
            if not lux_folder.startswith('LUX-'): continue
            for ext in ['png', 'jpg', 'jpeg', 'webp']:
                candidate = os.path.join(cat_path, lux_folder, f'1.{ext}')
                if os.path.exists(candidate):
                    relative = f'products/{cat_folder}/{lux_folder}/1.{ext}'
                    cat_name = REVERSE_SLUG_MAP.get(cat_folder)
                    if cat_name:
                        image_map[lux_folder] = (cat_name, relative)
                    break

print(f"📁 Найдено изображений: {len(image_map)}")

# 2. Получаем товары
products = list(Product.objects.all().select_related('category'))
print(f"📦 Товаров: {len(products)}")

# 3. Сопоставляем
updated = 0
added_imgs = 0

for product in products:
    cat_name = product.category.name if hasattr(product.category, 'name') else str(product.category)
    
    # Ищем свободное изображение для этой категории
    matched_lux = None
    matched_rel = None
    for lux_code, (img_cat, rel_path) in list(image_map.items()):
        if img_cat == cat_name:
            # Проверяем что этот LUX ещё не использован
            if not Product.objects.filter(article=lux_code).exclude(id=product.id).exists():
                matched_lux = lux_code
                matched_rel = rel_path
                break
    
    if matched_lux:
        # Обновляем article
        if product.article != matched_lux:
            product.article = matched_lux
            product.save(update_fields=['article'])
            updated += 1
            print(f"✅ {product.name[:45]:<45} → {matched_lux}")
        
        # Добавляем изображение
        if not ProductImage.objects.filter(product=product).exists():
            ProductImage.objects.create(
                product=product, image=matched_rel,
                image_url=f'/media/{matched_rel}',
                is_primary=True, sort_order=0
            )
            added_imgs += 1
        
        del image_map[matched_lux]

print(f"\n{'='*50}")
print(f"✅ Обновлено article: {updated}")
print(f"🖼️  Добавлено изображений: {added_imgs}")
print(f"⏭️  Осталось изображений: {len(image_map)}")
