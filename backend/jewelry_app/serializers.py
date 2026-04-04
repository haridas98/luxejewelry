from rest_framework import serializers
from .models import Category, Product, ProductImage, Set, SetProduct, Subcategory, Stone


class StoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stone
        fields = ['id', 'name', 'code', 'color']


class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'category']


class ProductImageSerializer(serializers.ModelSerializer):
    # Добавляем поле для полного URL картинки
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url', 'alt_text', 'is_primary', 'sort_order', 'created_at']

    def get_image_url(self, obj):
        # Сначала пробуем image_url (если оно заполнено)
        if obj.image_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_url)
            return f"http://localhost:8000{obj.image_url}"
        
        # Иначе используем загруженный файл
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"http://localhost:8000{obj.image.url}"
        return None


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    brand_name = serializers.CharField(source='brand.name', read_only=True)
    stones = StoneSerializer(many=True, read_only=True)
    stone_type = serializers.SerializerMethodField()
    sets = serializers.SerializerMethodField()
    admin_info = serializers.SerializerMethodField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if instance.images.exists():
            ret['images'] = ProductImageSerializer(
                instance.images.all(),
                many=True,
                context=self.context
            ).data
        return ret

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'article', 'category', 'subcategory', 'brand',
                  'metal', 'metal_purity', 'metal_display', 'material', 'weight', 'dimensions', 'stone_weight', 'ring_size',
                  'is_featured', 'cost_price', 'price_thb', 'price_per_gram_thb', 'is_active',
                  'is_out_of_stock', 'stock_quantity', 'sold_quantity', 'created_at', 'updated_at',
                  'images', 'category_name', 'subcategory_name', 'brand_name', 'stones', 'stone_type', 'sets',
                  'admin_info']

    def get_stone_type(self, obj):
        stones = obj.stones.all()
        return ', '.join([s.name for s in stones]) if stones else ''

    def get_sets(self, obj):
        sets = obj.sets.all()
        return [{'id': s.set.id, 'name': s.set.name, 'price': str(s.set.price)} for s in sets]

    def get_admin_info(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_staff:
            return {
                'cost_price': str(obj.cost_price) if obj.cost_price else None,
                'price_thb': str(obj.price_thb) if obj.price_thb else None,
                'stock_quantity': obj.stock_quantity,
                'sold_quantity': obj.sold_quantity,
                'article': obj.article,
            }
        return None


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True, is_out_of_stock=False).count()


class SetProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SetProduct
        fields = ['id', 'set', 'product', 'product_id', 'quantity', 'created_at']


class SetSerializer(serializers.ModelSerializer):
    set_products = SetProductSerializer(many=True, read_only=True)
    products_data = serializers.ListField(
        child=serializers.DictField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Set
        fields = '__all__'

    def create(self, validated_data):
        products_data = validated_data.pop('products_data', [])
        set_instance = Set.objects.create(**validated_data)

        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity', 1)

            if product_id:
                product = Product.objects.get(id=product_id)
                SetProduct.objects.create(set=set_instance, product=product, quantity=quantity)

        return set_instance

    def update(self, instance, validated_data):
        products_data = validated_data.pop('products_data', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if products_data:
            instance.set_products.all().delete()
            for product_data in products_data:
                product_id = product_data.get('product_id')
                quantity = product_data.get('quantity', 1)
                if product_id:
                    product = Product.objects.get(id=product_id)
                    SetProduct.objects.create(set=instance, product=product, quantity=quantity)

        return instance


class SetDetailSerializer(SetSerializer):
    set_products = SetProductSerializer(many=True, read_only=True)
