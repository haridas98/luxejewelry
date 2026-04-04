"""
Утилиты для управления медиа-файлами
"""
import os
import re
import uuid
from django.utils.text import slugify


def get_product_image_path(instance, filename):
    """
    Генерирует путь для изображения товара:
    products/{category_slug}/{article}/{number}.{ext}
    
    Пример: products/rings/graff-butterfly/1.jpg
    """
    # Расширение файла
    ext = filename.split('.')[-1].lower() if '.' in filename else 'jpg'
    
    # Категория
    category_slug = 'other'
    if instance.product.category:
        cat_name = instance.product.category.name.lower()
        category_map = {
            'кольца': 'rings',
            'серьги': 'earrings',
            'браслеты': 'bracelets',
            'кулоны': 'pendants',
            'подвески': 'pendants',
            'кольe': 'necklaces',
            'наборы': 'sets',
            'цепочки': 'chains',
            'ножные браслеты': 'anklets',
            'ожерелья': 'necklaces',
        }
        category_slug = category_map.get(cat_name, 'other')
    
    # Артикул или ID
    identifier = instance.product.article or instance.product.sku or f"ID{instance.product.id}"
    safe_identifier = "".join(c for c in identifier if c.isalnum() or c in ('-', '_')).strip()
    if not safe_identifier:
        safe_identifier = f"ID{instance.product.id}"
    
    # Определяем номер файла (сколько уже есть + 1)
    # Это сложно сделать на этапе save(), так как файл еще не сохранен.
    # Поэтому используем уникальное имя, но в папке артикула.
    # Django сам добавит уникальность если файл существует, но лучше дать понятное имя.
    # Для простоты используем sort_order или id картинки, если он есть.
    # Если это новая картинка, id еще нет.
    
    # Используем sort_order если задан, иначе уникальное имя
    if instance.sort_order > 0:
        filename_base = str(instance.sort_order)
    else:
        filename_base = uuid.uuid4().hex[:6]
        
    return os.path.join('products', category_slug, safe_identifier, f"{filename_base}.{ext}")


def get_brand_logo_path(instance, filename):
    """
    Генерирует путь для логотипа бренда:
    brands/{brand_slug}/logo.{ext}
    """
    ext = filename.split('.')[-1].lower() if '.' in filename else 'png'
    brand_slug = slugify(instance.name) or 'brand'
    
    return os.path.join('brands', brand_slug, f'logo.{ext}')


def generate_product_filename(product_name, brand_name=None):
    """
    Генерирует читаемое имя файла для товара.
    Пример: graff-butterfly-silhouette-diamond-stud-earrings.jpg
    """
    # Убираем спецсимволы и транслитерируем
    name = product_name.lower()
    name = re.sub(r'[^\w\s-]', '', name)  # Убираем спецсимволы
    name = re.sub(r'\s+', '-', name.strip())  # Пробелы -> дефисы
    name = re.sub(r'-+', '-', name)  # Убираем множественные дефисы
    
    # Добавляем бренд если есть
    if brand_name:
        brand_slug = re.sub(r'[^\w\s-]', '', brand_name.lower())
        brand_slug = re.sub(r'\s+', '-', brand_slug.strip())
        name = f"{brand_slug}-{name}"
    
    return name[:100]  # Ограничиваем длину


def transliterate(text):
    """
    Транслитерация русских букв в латинские.
    """
    mapping = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    
    result = []
    for char in text.lower():
        result.append(mapping.get(char, char))
    
    return ''.join(result)
