from django.contrib import admin
from .models import Category, Product, ProductImage, Set, SetProduct, Subcategory, Stone, Wishlist


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['article', 'name', 'category', 'price', 'ring_size', 'stock_quantity', 'has_stones', 'is_active', 'is_out_of_stock']
    list_filter = ['category', 'has_stones', 'is_active', 'is_out_of_stock', 'is_featured', 'ring_size']
    search_fields = ['name', 'description', 'sku', 'article']
    prepopulated_fields = {'sku': ('name',)}
    inlines = [ProductImageInline]
    date_hierarchy = 'created_at'
    filter_horizontal = ['stones']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'description', 'price', 'article', 'sku', 'category')
        }),
        ('Параметры изделия', {
            'fields': ('material', 'weight', 'dimensions', 'ring_size', 'stones', 'has_stones'),
            'classes': ('collapse',)
        }),
        ('Статусы', {
            'fields': ('is_active', 'is_out_of_stock', 'is_featured', 'stock_quantity')
        }),
        ('Административные поля', {
            'fields': ('cost_price', 'price_thb', 'price_per_gram_thb', 'sold_quantity'),
            'classes': ('collapse',)
        }),
    )


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
