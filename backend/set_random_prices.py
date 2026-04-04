import sys; sys.path.insert(0, '.')
import os
import random
os.environ['DJANGO_SETTINGS_MODULE'] = 'jewelry_store.settings'
import django
django.setup()

from jewelry_app.models import Product

# Диапазоны цен по категориям
PRICE_RANGES = {
    'Кольца': (15000, 350000),
    'Серьги': (10000, 180000),
    'Браслеты': (20000, 280000),
    'Кулоны': (12000, 200000),
    'Цепочки': (8000, 150000),
    'Ожерелья': (30000, 500000),
    'Наборы': (50000, 800000),
}

updated = 0
for product in Product.objects.all():
    if product.price == 0 or float(product.price) == 0:
        cat_name = product.category.name if hasattr(product.category, 'name') else str(product.category)
        min_p, max_p = PRICE_RANGES.get(cat_name, (10000, 200000))
        
        # Красивые цены (округляем до сотен)
        new_price = round(random.randint(min_p, max_p) / 100) * 100
        product.price = new_price
        product.save(update_fields=['price'])
        updated += 1
        print(f"✅ {product.name[:45]:<45} → {new_price:,} ₽ ({cat_name})")

print(f"\n✅ Обновлено цен: {updated}")
