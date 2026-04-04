import sys; sys.path.insert(0, '.')
import os, random
os.environ['DJANGO_SETTINGS_MODULE'] = 'jewelry_store.settings'
import django
django.setup()

from jewelry_app.models import Brand, Product, Category

# 1. Создаём бренды
brands_data = [
    ('Chopard', 'chopard'),
    ('Van Cleef & Arpels', 'van-cleef'),
    ('Cartier', 'cartier'),
    ('Graff', 'graff'),
    ('Messika', 'messika'),
    ('Buccellati', 'buccellati'),
    ('Bulgari', 'bulgari'),
    ('Tiffany & Co.', 'tiffany'),
    ('Chanel', 'chanel'),
    ('Dior', 'dior'),
    ('Harry Winston', 'harry-winston'),
    ('Boucheron', 'boucheron'),
]

for name, slug in brands_data:
    brand, created = Brand.objects.get_or_create(
        slug=slug,
        defaults={'name': name, 'is_active': True}
    )
    if created:
        print(f"✅ Бренд создан: {name}")

brands = list(Brand.objects.all())
print(f"\n📦 Всего брендов: {len(brands)}")

# 2. Назначаем рандомные бренды товарам
updated_brands = 0
for product in Product.objects.all():
    brand = random.choice(brands)
    product.brand = brand
    product.save(update_fields=['brand'])
    updated_brands += 1

print(f"✅ Назначено брендов: {updated_brands}")

# 3. Рандомные размеры для колец
RING_SIZES = ['15.0', '15.5', '16.0', '16.5', '17.0', '17.5', '18.0', '18.5', '19.0', '19.5', '20.0', '20.5', '21.0']
rings_category = Category.objects.filter(name='Кольца').first()

if rings_category:
    rings = Product.objects.filter(category=rings_category)
    updated_sizes = 0
    for ring in rings:
        # 30% колец — один размер, 70% — несколько
        if random.random() < 0.3:
            ring.ring_size = random.choice(RING_SIZES)
        else:
            num_sizes = random.randint(2, 5)
            sizes = random.sample(RING_SIZES, num_sizes)
            sizes.sort(key=lambda x: float(x))
            ring.ring_size = ', '.join(sizes)
        ring.save(update_fields=['ring_size'])
        updated_sizes += 1
    print(f"✅ Назначено размеров кольцам: {updated_sizes}")

print("\n✅ Готово!")
