from django.contrib import admin
from django import forms
from django.utils.html import format_html
from .models import Brand, Category, Product, ProductImage, Set, SetProduct, Subcategory, Stone, Wishlist


# Доступные размеры колец
RING_SIZES = ['15.0', '15.5', '16.0', '16.5', '17.0', '17.5', '18.0', '18.5', '19.0', '19.5', '20.0', '20.5', '21.0']

# Пробы для разных металлов
METAL_PURITIES = {
    'gold': [('585', '585'), ('750', '750'), ('916', '916 (22К)'), ('999', '999 (24К)')],
    'white_gold': [('585', '585'), ('750', '750')],
    'rose_gold': [('585', '585'), ('750', '750')],
    'silver': [('925', '925 Стерлинговое'), ('875', '875'), ('800', '800'), ('999', '999')],
    'platinum': [('950', '950'), ('900', '900'), ('850', '850')],
    'steel': [('', '—')],
    'titanium': [('', '—')],
}


class ProductForm(forms.ModelForm):
    """Кастомная форма с чекбоксами для размеров и материалами"""
    ring_sizes = forms.MultipleChoiceField(
        choices=[(s, f'{s}') for s in RING_SIZES],
        widget=forms.CheckboxSelectMultiple,
        required=False,
        label='Размеры (только для колец)'
    )

    class Meta:
        model = Product
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Размеры из строки
        if self.instance and self.instance.pk and self.instance.ring_size:
            sizes = [s.strip() for s in str(self.instance.ring_size).split(',') if s.strip()]
            self.initial['ring_sizes'] = sizes
        # Пробы на основе металла
        metal = self.instance.metal if self.instance.pk else ''
        self.fields['metal_purity'].widget.choices = [('', '—')] + METAL_PURITIES.get(metal, [])

    def save(self, commit=True):
        instance = super().save(commit=False)
        ring_sizes = self.cleaned_data.get('ring_sizes', [])
        instance.ring_size = ','.join(ring_sizes) if ring_sizes else ''
        if commit:
            instance.save()
        return instance


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="/media/{}" style="max-height:80px;" />', str(obj.image).replace('\\', '/'))
        return '—'
    image_preview.short_description = 'Превью'


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductForm
    list_display = [
        'name_link',
        'article',
        'category',
        'brand',
        'metal_display_short',
        'price',
        'stones_display',
        'ring_sizes_display',
        'stock_quantity',
        'is_active',
    ]
    list_display_links = []
    list_filter = ['category', 'brand', 'metal', 'is_active', 'is_out_of_stock', 'is_featured']
    search_fields = ['name', 'article']
    inlines = [ProductImageInline]
    date_hierarchy = 'created_at'
    filter_horizontal = ['stones']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'description', 'price', 'category', 'subcategory', 'brand', 'article')
        }),
        ('Материалы', {
            'fields': ('metal', 'metal_purity', 'material'),
            'description': 'Выберите металл и пробу. Для золота: 585, 750. Для серебра: 925.'
        }),
        ('Параметры', {
            'fields': ('weight', 'dimensions', 'stone_weight', 'stones', 'is_featured'),
        }),
        ('Размеры (только для колец)', {
            'fields': ('ring_sizes',),
            'classes': ('collapse',),
        }),
        ('Статусы', {
            'fields': ('is_active', 'is_out_of_stock', 'stock_quantity')
        }),
        ('Административные поля', {
            'fields': ('cost_price', 'price_thb', 'price_per_gram_thb', 'sold_quantity'),
            'classes': ('collapse',)
        }),
    )

    def name_link(self, obj):
        url = f'/admin/jewelry_app/product/{obj.id}/change/'
        return format_html('<a href="{}"><strong>{}</strong></a>', url, obj.name)
    name_link.short_description = 'Название'

    def metal_display_short(self, obj):
        return obj.metal_display or '—'
    metal_display_short.short_description = 'Материал'

    def stones_display(self, obj):
        stones = obj.stones.all()
        if stones:
            return ', '.join([s.name for s in stones])
        return 'Без камней'
    stones_display.short_description = 'Камни'

    def ring_sizes_display(self, obj):
        if obj.ring_size:
            sizes = [s.strip() for s in str(obj.ring_size).split(',') if s.strip()]
            return ', '.join(sizes)
        return '—'
    ring_sizes_display.short_description = 'Размеры'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_products_count', 'created_at']
    search_fields = ['name', 'description']

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True, is_out_of_stock=False).count()
    get_products_count.short_description = 'Активных товаров'


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category']
    list_filter = ['category']
    search_fields = ['name']


@admin.register(Stone)
class StoneAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'color']
    search_fields = ['name', 'code']
    list_filter = ['code']


class SetProductInline(admin.TabularInline):
    model = SetProduct
    extra = 1
    raw_id_fields = ('product',)


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'discount_percentage', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    inlines = [SetProductInline]


@admin.register(SetProduct)
class SetProductAdmin(admin.ModelAdmin):
    list_display = ['set', 'product', 'quantity', 'created_at']
    list_filter = ['set', 'product']
    raw_id_fields = ('set', 'product')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['user', 'product', 'created_at']
    list_filter = ['user', 'created_at']
    raw_id_fields = ('user', 'product')
