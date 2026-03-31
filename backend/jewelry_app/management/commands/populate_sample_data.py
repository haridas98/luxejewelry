from django.core.management.base import BaseCommand
from jewelry_app.models import Category, Product, ProductImage, Set, SetProduct
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Populate database with sample jewelry data'

    def handle(self, *args, **options):
        self.stdout.write('Starting to populate sample data...')
        
        # Create categories
        categories_data = [
            {'name': 'Кольца', 'description': 'Элегантные и изысканные кольца из различных материалов'},
            {'name': 'Серьги', 'description': 'Роскошные серьги для любого случая'},
            {'name': 'Браслеты', 'description': 'Стильные браслеты для повседневного ношения'},
            {'name': 'Кулоны', 'description': 'Элегантные кулоны с различными камнями'},
            {'name': 'Цепочки', 'description': 'Роскошные цепочки из золота и серебра'},
            {'name': 'Сеты', 'description': 'Комплекты ювелирных изделий'}
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            categories[cat.name] = cat
            if created:
                self.stdout.write(f'Created category: {cat.name}')
            else:
                self.stdout.write(f'Category already exists: {cat.name}')
        
        # Materials and stones for variety
        materials = ['Золото 585 пробы', 'Золото 750 пробы', 'Серебро 925 пробы', 'Платина', 'Сталь']
        stone_types = ['Бриллиант', 'Сапфир', 'Изумруд', 'Рубин', 'Аметист', 'Топаз', 'Жемчуг', 'Оникс', 'Агат']
        
        # Generate 50 sample products
        product_names = [
            'Обручальное кольцо "Элегия"', 'Серьги "Звездное небо"', 'Браслет "Волшебная ночь"',
            'Кулон "Сердце принцессы"', 'Цепочка "Королевская грация"', 'Кольцо "Лунный свет"',
            'Серьги "Капли росы"', 'Браслет "Морская волна"', 'Кулон "Око тигра"', 'Цепочка "Восточная сказка"',
            'Кольцо "Королевский бриллиант"', 'Серьги "Алые паруса"', 'Браслет "Сад Эдема"',
            'Кулон "Слеза ангела"', 'Цепочка "Золотая чешуя"', 'Кольцо "Камень мудрости"',
            'Серьги "Лучи солнца"', 'Браслет "Песнь ветра"', 'Кулон "Драконий глаз"', 'Цепочка "Нить судьбы"',
            'Кольцо "Снежинка"', 'Серьги "Мерцающие звезды"', 'Браслет "Лунный закат"',
            'Кулон "Капля океана"', 'Цепочка "Сияние луны"', 'Кольцо "Огненный цветок"',
            'Серьги "Кристаллы льда"', 'Браслет "Танец бабочек"', 'Кулон "Серебряная лилия"', 'Цепочка "Шелест трав"',
            'Кольцо "Золотой песок"', 'Серьги "Алмазная россыпь"', 'Браслет "Шкатулка времени"',
            'Кулон "Сердце океана"', 'Цепочка "Звездный путь"', 'Кольцо "Корона королевы"',
            'Серьги "Венок богини"', 'Браслет "Сияние рассвета"', 'Кулон "Ключ от сердца"', 'Цепочка "Сквозь века"',
            'Кольцо "Сияющий кристалл"', 'Серьги "Лепестки розы"', 'Браслет "Тайна луны"',
            'Кулон "Сфера любви"', 'Цепочка "Золотое кольцо"', 'Кольцо "Серебряная магия"',
            'Серьги "Капли нектара"', 'Браслет "Песня птицы"', 'Кулон "Сердце дракона"', 'Цепочка "Сияющая нить"'
        ]
        
        products = []
        for i in range(50):
            name = product_names[i] if i < len(product_names) else f'Украшение {i+1}'
            category_name = random.choice(list(categories.keys()))
            
            # Don't assign to 'Сеты' category for individual products
            if category_name == 'Сеты':
                category_name = random.choice([k for k in categories.keys() if k != 'Сеты'])
            
            product = Product.objects.create(
                name=name,
                description=f'Прекрасное ювелирное изделие {name.lower()}. Выполнено из высококачественных материалов с использованием традиций старинных мастеров.',
                price=Decimal(random.uniform(1000, 50000)).quantize(Decimal('0.01')),
                category=categories[category_name],
                material=random.choice(materials),
                weight=Decimal(random.uniform(2, 50)).quantize(Decimal('0.01')),
                dimensions=f'{random.randint(5, 20)} x {random.randint(3, 15)} mm',
                stone_type=random.choice(stone_types) if random.random() > 0.3 else '',
                stone_weight=Decimal(random.uniform(0.1, 5)).quantize(Decimal('0.01')) if random.random() > 0.3 else None,
                stock_quantity=random.randint(0, 20),
                is_active=True
            )
            products.append(product)
            self.stdout.write(f'Created product: {product.name}')
        
        # Create some sample sets
        ring_products = [p for p in products if p.category.name == 'Кольца']
        pendant_products = [p for p in products if p.category.name == 'Кулоны']
        earring_products = [p for p in products if p.category.name == 'Серьги']
        
        # Create ring + pendant sets
        for i in range(3):
            if len(ring_products) >= i+1 and len(pendant_products) >= i+1:
                set_name = f'Сет "Великолепие" #{i+1}'
                jewelry_set = Set.objects.create(
                    name=set_name,
                    description=f'Элегантный комплект из кольца и кулона "{set_name}". Идеальный выбор для особого случая.',
                    price=Decimal(ring_products[i].price + pendant_products[i].price).quantize(Decimal('0.01')),
                    discount_percentage=Decimal(10.00)
                )
                
                SetProduct.objects.create(set=jewelry_set, product=ring_products[i], quantity=1)
                SetProduct.objects.create(set=jewelry_set, product=pendant_products[i], quantity=1)
                
                self.stdout.write(f'Created set: {set_name}')
        
        # Create earring + pendant sets
        for i in range(3):
            if len(earring_products) >= i+1 and len(pendant_products) >= i+3:  # Use different pendants
                set_name = f'Сет "Гармония" #{i+1}'
                jewelry_set = Set.objects.create(
                    name=set_name,
                    description=f'Изысканный комплект из серег и кулона "{set_name}". Подчеркнет вашу индивидуальность.',
                    price=Decimal(earring_products[i].price + pendant_products[i+2].price).quantize(Decimal('0.01')),
                    discount_percentage=Decimal(12.00)
                )
                
                SetProduct.objects.create(set=jewelry_set, product=earring_products[i], quantity=1)
                SetProduct.objects.create(set=jewelry_set, product=pendant_products[i+2], quantity=1)
                
                self.stdout.write(f'Created set: {set_name}')
        
        # Add some sample images to products (simulated)
        for product in products[:20]:  # Add images to first 20 products
            for j in range(random.randint(1, 3)):
                ProductImage.objects.create(
                    product=product,
                    alt_text=f'Фото {j+1} товара {product.name}',
                    is_primary=(j == 0),  # First image is primary
                    sort_order=j
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully populated database with {len(products)} products, '
                f'{Category.objects.count()} categories, and {Set.objects.count()} sets!'
            )
        )