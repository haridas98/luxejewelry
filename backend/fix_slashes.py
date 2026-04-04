import sys; sys.path.insert(0, '.')
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'jewelry_store.settings'
import django
django.setup()

from jewelry_app.models import ProductImage

fixed = 0
for img in ProductImage.objects.all():
    img_str = str(img.image)
    new_path = img_str.replace('\\', '/')
    new_url = f'/media/{new_path}'
    
    if img_str != new_path or img.image_url != new_url:
        img.image = new_path
        img.image_url = new_url
        img.save(update_fields=['image', 'image_url'])
        fixed += 1
        print(f"✅ {img.product_id}: {new_path}")

print(f"\n✅ Исправлено: {fixed}")
