from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Category, Product, ProductImage, Set, Subcategory, Stone
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    SetSerializer,
    SetDetailSerializer,
    SubcategorySerializer,
    StoneSerializer
)


class StoneListCreateView(generics.ListCreateAPIView):
    queryset = Stone.objects.all()
    serializer_class = StoneSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    
    # Generate token
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        },
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }, status=status.HTTP_201_CREATED)


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Category.objects.all()
        # Аннотируем количество продуктов для каждой категории
        from django.db.models import Count, Q
        queryset = queryset.annotate(
            products_count=Count('products', filter=Q(products__is_active=True, products__is_out_of_stock=False))
        )
        return queryset


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class SubcategoryListCreateView(generics.ListCreateAPIView):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer
    filterset_fields = ['category']


class ProductListCreateView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'subcategory', 'material', 'has_stones', 'is_featured', 'stones']
    search_fields = ['name', 'description', 'sku', 'article']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    pagination_class = None  # Отключаем пагинацию для загрузки всех товаров

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, is_out_of_stock=False).prefetch_related('stones', 'images')

        # Фильтрация по цене
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Фильтрация по размеру кольца
        ring_size = self.request.query_params.get('ring_size', None)
        if ring_size:
            queryset = queryset.filter(ring_size=ring_size)

        # Фильтрация по камню (ID)
        stone_id = self.request.query_params.get('stone_id', None)
        if stone_id:
            queryset = queryset.filter(stones__id=stone_id)
        
        # Фильтрация по металлу
        metal = self.request.query_params.get('metal', None)
        if metal:
            queryset = queryset.filter(material__icontains=metal)

        return queryset.distinct()


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related('category').prefetch_related('stones', 'images')
    serializer_class = ProductSerializer


class SetListCreateView(generics.ListCreateAPIView):
    queryset = Set.objects.filter(is_active=True)
    serializer_class = SetSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']


class SetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Set.objects.all()
    serializer_class = SetDetailSerializer


@api_view(['GET'])
def category_products(request, pk):
    """
    Get all products for a specific category
    """
    try:
        category = Category.objects.get(pk=pk)
        products = Product.objects.filter(category=category, is_active=True, is_out_of_stock=False)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def featured_products(request):
    """
    Get featured products (most recent or highest rated)
    """
    products = Product.objects.filter(is_active=True, is_featured=True, is_out_of_stock=False).order_by('-created_at')[:10]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def product_search(request):
    """
    Search products by various criteria
    """
    query = request.GET.get('q', '')
    category_id = request.GET.get('category', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    has_stones = request.GET.get('has_stones', '')

    products = Product.objects.filter(is_active=True, is_out_of_stock=False)

    if query:
        products = products.filter(name__icontains=query)

    if category_id:
        products = products.filter(category_id=category_id)

    if min_price:
        products = products.filter(price__gte=min_price)

    if max_price:
        products = products.filter(price__lte=max_price)

    if has_stones:
        products = products.filter(has_stones=(has_stones.lower() == 'true'))

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST', 'DELETE'])
def wishlist_view(request):
    """Управление избранным"""
    from .models import Wishlist
    from rest_framework.permissions import IsAuthenticatedOrReadOnly
    
    if request.method == 'GET':
        # Получить все избранные товары пользователя
        if request.user.is_authenticated:
            wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
            products = [item.product for item in wishlist_items]
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        return Response([])
    
    if request.method == 'POST':
        # Добавить в избранное
        if not request.user.is_authenticated:
            return Response({'error': 'Требуется авторизация'}, status=status.HTTP_401_UNAUTHORIZED)
        
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'product_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(id=product_id)
            wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
            return Response({'success': True, 'created': created})
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        # Удалить из избранного
        if not request.user.is_authenticated:
            return Response({'error': 'Требуется авторизация'}, status=status.HTTP_401_UNAUTHORIZED)
        
        product_id = request.data.get('product_id')
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'success': True})