import random
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from jewelry_app.models import Category, Product, ProductImage, Set, SetProduct, Subcategory


class Command(BaseCommand):
    help = 'Populate database with sample jewelry items and subcategories'

    # Подкатегории для каждой категории
    subcategories_data = {
        'Кольца': {
            'sizes': ['15.5', '16', '16.5', '17', '17.5', '18', '18.5', '19', '19.5', '20'],
            'types': ['С камнями', 'Без камней', 'Обручальные', 'Помолвочные'],
        },
        'Серьги': {
            'types': ['Гвоздики', 'Подвески', 'Кольца', 'С камнями', 'Без камней'],
        },
        'Браслеты': {
            'types': ['Цепочные', 'С камнями', 'Панцирные', 'Теннис'],
        },
        'Кулоны': {
            'types': ['С камнями', 'Без камней', 'Сердце', 'Геометрические'],
        },
        'Цепочки': {
            'types': ['Бисмарк', 'Венецианская', 'Панцирь', 'Змея', 'Якорное плетение'],
        },
    }

    category_images = {
        'Кольца': [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1598560916717-5159e176c7ee?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1598560916717-5159e176c7ee?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
        ],
        'Серьги': [
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1596919017620-80b0deb78662?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1596919017620-80b0deb78662?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1617038224558-28ad3fb558a7?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1596919017620-80b0deb78662?w=800&h=800&fit=crop',
        ],
        'Браслеты': [
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
        ],
        'Кулоны': [
            'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1602751584552-8ba420552259?w=800&h=800&fit=crop',
        ],
        'Цепочки': [
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
            'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=800&fit=crop',
        ],
    }

    category_data = {
        'Кольца': {
            'names': [
                'Кольцо "Вечность"', 'Кольцо "Грация"', 'Кольцо "Империя"', 
                'Кольцо "Нежность"', 'Кольцо "Страсть"', 'Кольцо "Аурелия"',
                'Кольцо "Белла"', 'Кольцо "Виктория"',
            ],
            'descriptions': [
                'Изящное кольцо с утончённым дизайном, идеально подходящее для повседневной носки.',
                'Роскошное кольцо, созданное для особых случаев и торжественных мероприятий.',
                'Классическое кольцо с современным акцентом, подчеркивающее вашу индивидуальность.',
                'Элегантное кольцо с безупречной отделкой, символизирующее вечную любовь.',
                'Уникальное кольцо авторской работы, воплощение изыска и стиля.',
            ],
            'materials': ['Золото 585', 'Золото 750', 'Платина 950', 'Серебро 925', 'Белое золото 585'],
            'stones': ['Бриллиант', 'Сапфир', 'Рубин', 'Изумруд', 'Топаз', 'Аметист', 'Гранат', 'Жемчуг'],
            'price_range': (15000, 250000),
        },
        'Серьги': {
            'names': [
                'Серьги "Луна"', 'Серьги "Звезда"', 'Серьги "Каприз"', 
                'Серьги "Мелодия"', 'Серьги "Поэзия"', 'Серьги "Аделия"',
                'Серьги "Бриллиант"', 'Серьги "Венера"',
            ],
            'descriptions': [
                'Изящные серьги, добавляющие образу женственности и шарма.',
                'Роскошные серьги для вечернего выхода, привлекающие восхищённые взгляды.',
                'Лаконичные серьги-гвоздики на каждый день с элегантным блеском.',
                'Длинные серьги-подвески, создающие эффект лёгкости и движения.',
                'Винтажные серьги с уникальным дизайном, напоминающие об эпохе ар-деко.',
            ],
            'materials': ['Золото 585', 'Золото 750', 'Платина 950', 'Серебро 925', 'Белое золото 750'],
            'stones': ['Бриллиант', 'Сапфир', 'Рубин', 'Изумруд', 'Топаз', 'Аметист', 'Цитрин', 'Перидот'],
            'price_range': (12000, 180000),
        },
        'Браслеты': {
            'names': [
                'Браслет "Шарм"', 'Браслет "Грация"', 'Браслет "Фортуна"', 
                'Браслет "Мечта"', 'Браслет "Гармония"', 'Браслет "Афина"',
                'Браслет "Бриллиант"', 'Браслет "Волна"',
            ],
            'descriptions': [
                'Элегантный браслет, подчеркивающий изящество запястья.',
                'Массивный браслет в современном стиле для уверенных в себе.',
                'Тонкий цепочный браслет с подвесками для романтического образа.',
                'Браслет-панцирь с безупречной полировкой, классика на все времена.',
                'Браслет с авторской гравировкой, идеальный подарок для близких.',
            ],
            'materials': ['Золото 585', 'Золото 750', 'Платина 950', 'Серебро 925', 'Розовое золото 585'],
            'stones': ['Бриллиант', 'Сапфир', 'Рубин', 'Фианит', 'Топаз', 'Аметист', 'Оникс', 'Малахит'],
            'price_range': (20000, 350000),
        },
        'Кулоны': {
            'names': [
                'Кулон "Сердце"', 'Кулон "Солнце"', 'Кулон "Звезда"', 
                'Кулон "Луна"', 'Кулон "Капля"', 'Кулон "Ангел"',
                'Кулон "Бабочка"', 'Кулон "Вечность"',
            ],
            'descriptions': [
                'Изящный кулон в форме сердца, символ любви и преданности.',
                'Кулон с крупным камнем в элегантной оправе для вечернего образа.',
                'Минималистичный кулон на тонкой цепочке для повседневной носки.',
                'Кулон с гравировкой, хранящий ваши самые тёплые воспоминания.',
                'Авторский кулон с уникальным дизайном, подчёркивающий индивидуальность.',
            ],
            'materials': ['Золото 585', 'Золото 750', 'Платина 950', 'Серебро 925', 'Белое золото 585'],
            'stones': ['Бриллиант', 'Сапфир', 'Рубин', 'Изумруд', 'Топаз', 'Аметист', 'Гранат', 'Опал'],
            'price_range': (10000, 150000),
        },
        'Цепочки': {
            'names': [
                'Цепочка "Классика"', 'Цепочка "Венецианская"', 'Цепочка "Бисмарк"', 
                'Цепочка "Панцирь"', 'Цепочка "Змея"', 'Цепочка "Ангел"',
                'Цепочка "Бриллиант"', 'Цепочка "Волна"',
            ],
            'descriptions': [
                'Классическая цепочка плетения "Бисмарк" — надёжность и стиль.',
                'Тонкая венецианская цепочка для изящного кулона.',
                'Массивная цепь в стиле "Панцирь" для смелого образа.',
                'Цепочка плетения "Змея" с характерным блеском и гибкостью.',
                'Универсальная цепочка средней толщины на каждый день.',
            ],
            'materials': ['Золото 585', 'Золото 750', 'Платина 950', 'Серебро 925', 'Белое золото 585'],
            'stones': ['', '', '', '', '', ''],
            'price_range': (8000, 200000),
        },
    }

    set_data = [
        {'name': 'Сет "Романтика"', 'description': 'Изящный комплект из кольца и кулона в форме сердца.', 'discount': 10},
        {'name': 'Сет "Королевский"', 'description': 'Роскошный набор из серёг и кулона с бриллиантами.', 'discount': 15},
        {'name': 'Сет "Нежность"', 'description': 'Комплект из кулона и серёг-гвоздиков с жемчугом.', 'discount': 12},
        {'name': 'Сет "Грация"', 'description': 'Элегантный сет из кольца и серёг в классическом стиле.', 'discount': 10},
        {'name': 'Сет "Вечерний"', 'description': 'Комплект из браслета и серёг для вечернего выхода.', 'discount': 15},
        {'name': 'Сет "Минимализм"', 'description': 'Лаконичный набор из цепочки и кулона.', 'discount': 8},
        {'name': 'Сет "Империя"', 'description': 'Роскошный комплект из кольца, серёг и кулона.', 'discount': 20},
        {'name': 'Сет "Весна"', 'description': 'Нежный комплект из кулона и серёг с цветочными мотивами.', 'discount': 10},
    ]

    def handle(self, *args, **kwargs):
        self.stdout.write('Начало заполнения базы данных...')

        # Очищаем базу
        ProductImage.objects.all().delete()
        SetProduct.objects.all().delete()
        Set.objects.all().delete()
        Product.objects.all().delete()
        Subcategory.objects.all().delete()
        Category.objects.all().delete()

        # Создаём категории и подкатегории
        categories = {}
        subcategories = {}
        
        for cat_name, subcat_data in self.subcategories_data.items():
            category, _ = Category.objects.get_or_create(
                name=cat_name,
                defaults={'description': f'Категория: {cat_name}'}
            )
            categories[cat_name] = category
            
            # Создаём подкатегории
            for subcat_type, values in subcat_data.items():
                if subcat_type == 'sizes':
                    # Размеры колец
                    for size in values:
                        subcat, _ = Subcategory.objects.get_or_create(
                            category=category,
                            name=f'Размер {size}'
                        )
                else:
                    # Типы украшений
                    for value in values:
                        subcat, created = Subcategory.objects.get_or_create(
                            category=category,
                            name=value
                        )
                        if created:
                            subcategories[f'{cat_name}_{value}'] = subcat
                        else:
                            # Если подкатегория уже существует, берём первую найденную
                            subcat = Subcategory.objects.filter(category=category, name=value).first()
                            subcategories[f'{cat_name}_{value}'] = subcat
            
            self.stdout.write(f'Создана категория: {cat_name} с подкатегориями')

        # Создаём продукты
        products = []
        for cat_name, cat_info in self.category_data.items():
            category = categories[cat_name]
            images = self.category_images.get(cat_name, [])
            subcats = list(category.subcategories.all())
            
            for i in range(len(cat_info['names'])):
                name = cat_info['names'][i]
                description = random.choice(cat_info['descriptions'])
                material = random.choice(cat_info['materials'])
                stone = random.choice(cat_info['stones']) if cat_info['stones'] and cat_info['stones'][0] else ''
                price = random.randint(*cat_info['price_range'])
                
                weight = round(random.uniform(2, 15), 2)
                dimensions = f"{random.randint(5, 20)}x{random.randint(5, 20)}x{random.randint(2, 10)} мм"
                image_url = images[i % len(images)] if images else ''
                
                base_sku = slugify(name)[:30]
                sku = f"{base_sku}-{category.name[:3].upper()}-{i+1:02d}"
                
                # Определяем подкатегорию
                subcategory = None
                has_stones = bool(stone)
                ring_size = ''
                
                if cat_name == 'Кольца':
                    ring_size = random.choice(self.subcategories_data['Кольца']['sizes'])
                    has_stones = random.choice([True, False])
                    # Выбираем подкатегорию по типу
                    type_name = 'С камнями' if has_stones else 'Без камней'
                    subcategory = subcategories.get(f'{cat_name}_{type_name}')
                
                product = Product.objects.create(
                    name=name,
                    description=description,
                    price=price,
                    category=category,
                    subcategory=subcategory,
                    sku=sku,
                    material=material,
                    weight=weight,
                    dimensions=dimensions,
                    stone_type=stone,
                    stone_weight=round(random.uniform(0.1, 2.5), 2) if stone else None,
                    stock_quantity=random.randint(5, 50),
                    is_active=True,
                    is_out_of_stock=False,
                    is_featured=random.choice([True, False]),
                    has_stones=has_stones,
                    ring_size=ring_size,
                )
                products.append(product)
                
                # Создаём главное изображение
                ProductImage.objects.create(
                    product=product,
                    image=image_url,
                    alt_text=f'{name} - фото 1',
                    is_primary=True,
                    sort_order=0,
                )
                
                self.stdout.write(f'Создан продукт: {name} ({category.name})')

        # Создаём сеты
        for set_info in self.set_data:
            jewelry_set = Set.objects.create(
                name=set_info['name'],
                description=set_info['description'],
                discount_percentage=set_info['discount'],
                is_active=True,
            )
            
            num_products = random.randint(2, 3)
            selected_products = random.sample(products, num_products)
            
            for product in selected_products:
                SetProduct.objects.create(
                    set=jewelry_set,
                    product=product,
                    quantity=1,
                )
            
            total_price = sum(p.price for p in selected_products)
            discount = total_price * (set_info['discount'] / 100)
            jewelry_set.price = total_price - discount
            jewelry_set.save()
            
            self.stdout.write(f'Создан сет: {set_info["name"]} ({num_products} продукта)')

        self.stdout.write(self.style.SUCCESS(
            f'Готово! Создано {Product.objects.count()} продуктов, {Subcategory.objects.count()} подкатегорий и {Set.objects.count()} сетов.'
        ))
