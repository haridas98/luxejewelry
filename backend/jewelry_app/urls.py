from django.urls import path
from . import views

urlpatterns = [
    # Auth URLs
    path('auth/register/', views.register_user, name='register'),
    
    # Stone URLs
    path('stones/', views.StoneListCreateView.as_view(), name='stone-list-create'),
    
    # Category URLs
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='category-detail'),
    path('categories/<int:pk>/products/', views.category_products, name='category-products'),

    # Subcategory URLs
    path('subcategories/', views.SubcategoryListCreateView.as_view(), name='subcategory-list-create'),

    # Product URLs
    path('products/', views.ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),

    # Set URLs
    path('sets/', views.SetListCreateView.as_view(), name='set-list-create'),
    path('sets/<int:pk>/', views.SetDetailView.as_view(), name='set-detail'),

    # Additional utility URLs
    path('featured-products/', views.featured_products, name='featured-products'),
    path('search/', views.product_search, name='product-search'),
    path('wishlist/', views.wishlist_view, name='wishlist'),
]