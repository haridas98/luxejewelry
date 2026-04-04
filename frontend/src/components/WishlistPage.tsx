import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductImage from './ProductImage';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import { FadeIn, StaggerContainer, StaggerItem } from './animations';
import type { Product, ProductImage as ProductImageType } from '../types';

interface ExtendedProduct extends Product {
  stone_type?: string;
  is_out_of_stock?: boolean;
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<number[]>([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart.map((item: any) => item.id));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWishlist(token);
  }, [navigate]);

  const fetchWishlist = async (token: string) => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoint(ENDPOINTS.wishlist), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(apiEndpoint(ENDPOINTS.wishlist), {
        data: { product_id: productId },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlistItems(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = (product: ExtendedProduct) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find((item: any) => item.id === product.id);
    if (!exists) {
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(String(product.price)),
        image: product.images?.[0]?.image_url || product.images?.[0]?.image,
        material: product.material,
        quantity: 1,
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      setCart(prev => [...prev, product.id]);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          {/* Header */}
          <FadeIn>
            <div className="mb-10">
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">Избранное</h1>
              <p className="text-on-surface-variant">
                {wishlistItems.length > 0
                  ? `${wishlistItems.length} ${wishlistItems.length === 1 ? 'товар' : wishlistItems.length < 5 ? 'товара' : 'товаров'}`
                  : 'Пока пусто'}
              </p>
            </div>
          </FadeIn>

          {wishlistItems.length === 0 ? (
            <FadeIn>
              <div className="bg-surface-container-low p-16 text-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">favorite_border</span>
                <h3 className="font-headline text-2xl mb-3">Список избранного пуст</h3>
                <p className="text-on-surface-variant mb-8">Добавьте украшения, которые вам понравились</p>
                <Link
                  to="/collections"
                  className="inline-block bg-primary text-on-primary px-10 py-4 text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Перейти в каталог
                </Link>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer staggerDelay={0.08}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                <AnimatePresence>
                  {wishlistItems.map((product) => (
                    <StaggerItem key={product.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        {/* Image */}
                        <div
                          className="relative overflow-hidden bg-surface-variant mb-4 cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          {product.images && product.images.length > 0 ? (
                            <ProductImage
                              className="w-full aspect-[4/5] object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                              src={product.images[0]?.image_url || product.images[0]?.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="w-full aspect-[4/5] bg-surface-variant flex items-center justify-center">
                              <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
                            </div>
                          )}

                          {/* Remove button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); removeFromWishlist(product.id); }}
                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-surface/80 backdrop-blur-sm rounded-full hover:bg-surface transition-colors"
                            title="Убрать из избранного"
                          >
                            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1", color: '#000' }}>
                              close
                            </span>
                          </button>

                          {product.is_out_of_stock && (
                            <div className="absolute top-2 left-2 bg-primary-container text-surface text-[9px] uppercase tracking-widest px-2 py-1">
                              Нет в наличии
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="space-y-1">
                          <h2
                            className="text-sm md:text-base font-medium group-hover:text-secondary transition-colors line-clamp-1 cursor-pointer"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.name}
                          </h2>
                          {product.stone_type && (
                            <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant line-clamp-1">
                              {product.stone_type}
                            </p>
                          )}
                          {/* Price + Icons */}
                          <div className="flex items-center justify-between pt-2">
                            <p className="text-sm md:text-base font-medium">
                              {Number(product.price).toLocaleString('ru-RU')} ₽
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => addToCart(product)}
                                className="p-1 hover:scale-110 transition-transform"
                                disabled={product.is_out_of_stock}
                                title={cart.includes(product.id) ? 'В корзине' : 'В корзину'}
                              >
                                <span
                                  className="material-symbols-outlined text-xl"
                                  style={
                                    cart.includes(product.id)
                                      ? { fontVariationSettings: "'FILL' 1", color: '#000' }
                                      : { fontVariationSettings: "'FILL' 0", color: '#444748' }
                                  }
                                >
                                  shopping_cart
                                </span>
                              </button>
                              <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="p-1 hover:scale-110 transition-transform"
                                title="Убрать из избранного"
                              >
                                <span
                                  className="material-symbols-outlined text-xl"
                                  style={{ fontVariationSettings: "'FILL' 1", color: '#000' }}
                                >
                                  favorite
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </AnimatePresence>
              </div>
            </StaggerContainer>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
