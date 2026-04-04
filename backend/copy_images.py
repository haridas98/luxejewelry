import sys; sys.path.insert(0, '.')
import os
import shutil
os.environ['DJANGO_SETTINGS_MODULE'] = 'jewelry_store.settings'
import django
django.setup()

from jewelry_app.models import Product, ProductImage

MEDIA_BASE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media', 'products')
copied = 0
new_imgs = 0

for product in Product.objects.all():
    imgs = ProductImage.objects.filter(product=product)
    if not imgs.exists():
        continue
    
    # Берём первое изображение как основу
    base_img = imgs.first()
    base_path = str(base_img.image)  # products/category/LUX-XXXX/1.png
    
    # Извлекаем папку
    parts = base_path.replace('\\', '/').split('/')
    # parts = ['products', 'category', 'LUX-XXXX', '1.png']
    if len(parts) < 4:
        continue
    
    category = parts[1]
    lux_code = parts[2]
    orig_filename = parts[3]  # 1.png
    full_dir = os.path.join(MEDIA_BASE, category, lux_code)
    
    if not os.path.exists(full_dir):
        continue
    
    # Оригинальный файл
    ext = orig_filename.split('.')[-1]  # png или jpg
    src = os.path.join(full_dir, orig_filename)
    
    if not os.path.exists(src):
        continue
    
    # Копируем 1.png -> 2.png, 3.png, 4.png, 5.png
    for i in range(2, 6):
        dst = os.path.join(full_dir, f'{i}.{ext}')
        
        if not os.path.exists(dst):
            shutil.copy2(src, dst)
            copied += 1
        
        # Создаём ProductImage запись
        rel_path = f'products/{category}/{lux_code}/{i}.{ext}'
        if not ProductImage.objects.filter(product=product, image=rel_path).exists():
            ProductImage.objects.create(
                product=product,
                image=rel_path,
                image_url=f'/media/{rel_path}',
                is_primary=(i == 1),
                sort_order=i - 1
            )
            new_imgs += 1

print(f"📁 Скопировано файлов: {copied}")
print(f"🖼️  Создано записей ProductImage: {new_imgs}")
print(f"✅ Всего изображений: {ProductImage.objects.count()}")
