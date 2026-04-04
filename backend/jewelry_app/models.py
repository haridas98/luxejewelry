from django.db import models
from django.utils.text import slugify
from .utils import get_product_image_path, get_brand_logo_path


class Brand(models.Model):
    """Бренды ювелирных изделий"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to=get_brand_logo_path, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Brands"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Stone(models.Model):
    """Камни (общие для всех категорий)"""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True, help_text="Код из Excel (TPZ, EMD, etc.)")
    color = models.CharField(max_length=20, blank=True, help_text="HEX цвет для отображения")
    
    class Meta:
        verbose_name_plural = "Stones"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"


class Subcategory(models.Model):
    """Подкатегории (типы украшений)"""
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    
    class Meta:
        verbose_name_plural = "Subcategories"
        unique_together = ['category', 'name']

    def __str__(self):
        return f"{self.category.name}: {self.name}"


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Артикулы
    article = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="Артикул товара (например, RG-001)")

    # Бренд
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')

    # Категория и подкатегория
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    # Камни (многие-ко-многим)
    stones = models.ManyToManyField(Stone, blank=True, related_name='products')

    # Материалы
    METAL_CHOICES = [
        ('gold', 'Золото'),
        ('white_gold', 'Белое золото'),
        ('rose_gold', 'Розовое золото'),
        ('silver', 'Серебро'),
        ('platinum', 'Платина'),
        ('steel', 'Сталь'),
        ('titanium', 'Титан'),
    ]
    PURPLE_CHOICES = [
        ('585', '585 проба'),
        ('750', '750 проба'),
        ('916', '916 проба (22К)'),
        ('999', '999 проба (24К)'),
    ]
    SILVER_CHOICES = [
        ('925', '925 проба (Стерлинговое)'),
        ('875', '875 проба'),
        ('800', '800 проба'),
        ('999', '999 проба'),
    ]
    PLATINUM_CHOICES = [
        ('950', '950 проба'),
        ('900', '900 проба'),
        ('850', '850 проба'),
    ]

    metal = models.CharField(max_length=20, choices=METAL_CHOICES, blank=True, help_text="Основной металл")
    metal_purity = models.CharField(max_length=10, blank=True, help_text="Проба металла")
    material = models.CharField(max_length=100, blank=True, help_text="Дополнительное описание материала")
    weight = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True)
    stone_weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    
    # Параметры для разных типов украшений
    ring_size = models.CharField(max_length=20, blank=True, null=True, help_text="Размер кольца (для колец)")
    is_featured = models.BooleanField(default=False, help_text="Показывать на главной")

    # Админские поля (скрыты от клиентов)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Себестоимость в рублях")
    price_thb = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, help_text="Цена в батах")
    price_per_gram_thb = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True, help_text="Цена за грамм в батах")

    # Статусы
    is_active = models.BooleanField(default=True, help_text="Скрыть из отображения")
    is_out_of_stock = models.BooleanField(default=False, help_text="Нет в наличии")
    stock_quantity = models.PositiveIntegerField(default=0)
    sold_quantity = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.article or self.name} - {self.price} ₽"

    @property
    def metal_display(self):
        """Возвращает читаемое название металла и пробы"""
        if not self.metal:
            return ''
        metal_names = dict(self.METAL_CHOICES)
        name = metal_names.get(self.metal, self.metal)
        if self.metal_purity:
            return f"{name} {self.metal_purity}"
        return name

    class Meta:
        ordering = ['-created_at']


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=get_product_image_path, blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, help_text="URL изображения (локальный или внешний)")
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.product.name} - Image"


class Set(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']


class SetProduct(models.Model):
    set = models.ForeignKey(Set, on_delete=models.CASCADE, related_name='set_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sets')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.set.name} - {self.product.name}"

    class Meta:
        unique_together = ('set', 'product')


class Wishlist(models.Model):
    """Избранное пользователя"""
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlists')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
