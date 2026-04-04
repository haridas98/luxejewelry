import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductImage from './ProductImage';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import { FadeIn } from './animations';
import type { Product, Stone, ProductImage as ProductImageType } from '../types';

interface ExtendedProduct extends Product {
  stone_type?: string;
  ring_size?: number | string;
  article?: string;
  is_out_of_stock?: boolean;
  category_name?: string;
  admin_info?: {
    article?: string;
    stock_quantity: number;
    cost_price?: number;
    price_thb?: number;
    sold_quantity?: number;
  };
  sets?: Product[];
}

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productSets, setProductSets] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [inCart, setInCart] = useState(false);

  const fetchWishlist = async (token: string, productId: number) => {
    try {
      const response = await axios.get(apiEndpoint(ENDPOINTS.wishlist), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setIsInWishlist(response.data.some((p: Product) => p.id === productId));
    } catch (error: any) {
      if (error.response && error.response.status !== 401) {
        console.error('Error fetching wishlist:', error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.is_staff || false);
        if (id) {
          fetchWishlist(token, parseInt(id));
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        // Удаляем из избранного
        const response = await axios.get(apiEndpoint(ENDPOINTS.wishlist), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const wishlistItems = response.data;
        const item = wishlistItems.find((w: any) => w.product?.id === product.id || w.id === product.id);
        if (item) {
          await axios.delete(apiEndpoint(`/api/wishlist/${item.id}/`), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
        setIsInWishlist(false);
      } else {
        // Добавляем в избранное
        await axios.post(
          apiEndpoint(ENDPOINTS.wishlist),
          { product_id: product.id },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setIsInWishlist(true);
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Удаляем из корзины
      cart.splice(existingIndex, 1);
      setInCart(false);
    } else {
      // Добавляем в корзину
      cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(String(product.price)),
        image: product.images?.[0]?.image_url || product.images?.[0]?.image,
        material: product.material,
        quantity: 1,
      });
      setInCart(true);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some((item: any) => item.id === product?.id));
  }, [product]);

  useEffect(() => {
    if (!product?.id) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setInCart(cart.some((item: any) => item.id === product.id));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(apiEndpoint(`/api/products/${id}/`));
        setProduct(response.data);
        if (response.data.sets && response.data.sets.length > 0) {
          setProductSets(response.data.sets);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const adminInfo = product.admin_info;
  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumbs */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-on-surface-variant">
            <Link to="/" className="hover:text-secondary transition-colors">Главная</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-secondary transition-colors">Коллекции</Link>
            <span>/</span>
            <Link to={`/category/${product.category}`} className="hover:text-secondary transition-colors">{product.category_name}</Link>
            <span>/</span>
            <span className="text-on-surface">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Gallery */}
            <div className="lg:w-2/3 xl:w-3/5">
              {/* Главное изображение */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="relative aspect-[3/4] lg:aspect-[5/6] bg-surface-container-low overflow-hidden cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ProductImage
                    src={images[selectedImage]?.image_url || images[selectedImage]?.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  />
                  
                  {/* Навигационные стрелки */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface transition-colors"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </>
                  )}

                  {/* Счётчик изображений */}
                  <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium">
                    {selectedImage + 1} / {images.length}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Миниатюры */}
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedImage(idx); setIsZoomed(false); }}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 ${
                        selectedImage === idx 
                          ? 'ring-2 ring-secondary ring-offset-2' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <ProductImage
                        src={(img as ProductImageType).image_url || (img as ProductImageType).image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Info — правая узкая колонка */}
            <div className="lg:w-5/12 xl:w-1/4 lg:sticky lg:top-24 lg:h-fit px-4 md:px-8 lg:px-12 py-8 lg:py-12">
              <FadeIn direction="left">
                {/* Категория */}
                <Link 
                  to={`/category/${product.category}`} 
                  className="inline-block text-secondary text-[10px] tracking-[0.2em] uppercase mb-4 hover:opacity-70 transition-opacity"
                >
                  {product.category_name}
                </Link>

                {/* Название */}
                <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl text-primary leading-tight mb-4 -tracking-[0.02em]">
                  {product.name}
                </h1>

                {/* Артикул */}
                {product.article && (
                  <p className="text-xs text-on-surface-variant tracking-widest uppercase mb-6">
                    Арт. {product.article}
                  </p>
                )}

                {/* Описание */}
                {product.description && (
                  <p className="text-on-surface-variant leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                {/* Цена — Стоимость */}
                <div className="mb-8">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant">Стоимость</span>
                    <span className="font-headline text-4xl text-primary">
                      {Number(product.price).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="h-px bg-outline-variant/30"></div>
                </div>

                {/* Характеристики */}
                <div className="space-y-6 mb-8">
                  {product.metal_display && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Материал</span>
                      <span className="font-medium">{product.metal_display}</span>
                    </div>
                  )}
                  {product.material && !product.metal_display && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Материал</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Вес</span>
                      <span className="font-medium">{product.weight} г</span>
                    </div>
                  )}
                  {product.stone_type && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Камни</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {product.stones && product.stones.length > 0 ? (
                          product.stones.map((stone: Stone) => (
                            <span
                              key={stone.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full"
                              style={{ backgroundColor: (stone.color || '#ccc') + '20', color: stone.color }}
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stone.color }}></span>
                              {stone.name}
                            </span>
                          ))
                        ) : (
                          <span className="font-medium">{product.stone_type}</span>
                        )}
                      </div>
                    </div>
                  )}
                  {product.ring_size && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Размер</span>
                      <span className="font-medium">{product.ring_size}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                      <span className="text-xs uppercase tracking-widest text-on-surface-variant">Размеры</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  )}
                </div>

                {/* Admin Panel */}
                {isAdmin && adminInfo && (
                  <div className="mb-8 p-6 bg-primary-container text-surface border border-secondary/30">
                    <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      Админ-панель
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Артикул</span>
                        <span className="font-bold">{adminInfo.article || product.article || 'Н/Д'}</span>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Остаток</span>
                        <span className={`font-bold ${adminInfo.stock_quantity < 5 ? 'text-secondary-fixed-dim' : ''}`}>
                          {adminInfo.stock_quantity} шт
                        </span>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Себестоимость</span>
                        <span className="font-bold">{adminInfo.cost_price ? `${adminInfo.cost_price} ₽` : 'Н/Д'}</span>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Цена ฿</span>
                        <span className="font-bold">{adminInfo.price_thb ? `${adminInfo.price_thb} ฿` : 'Н/Д'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Кнопки действий — иконки рядом */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Кнопка корзины — без рамки, заполняется чёрным */}
                  <button
                    onClick={addToCart}
                    className="p-2 transition-all duration-200 hover:scale-110"
                    title={inCart ? 'Убрать из корзины' : 'Добавить в корзину'}
                  >
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={inCart
                        ? { fontVariationSettings: "'FILL' 1", color: '#000' }
                        : { fontVariationSettings: "'FILL' 0", color: '#444748' }
                      }
                    >
                      shopping_cart
                    </span>
                  </button>

                  {/* Кнопка избранного — без рамки, заполняется чёрным */}
                  <button
                    onClick={toggleWishlist}
                    className="p-2 transition-all duration-200 hover:scale-110"
                    title={isInWishlist ? 'Убрать из избранного' : 'В избранное'}
                  >
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={isInWishlist
                        ? { fontVariationSettings: "'FILL' 1", color: '#000' }
                        : { fontVariationSettings: "'FILL' 0", color: '#444748' }
                      }
                    >
                      favorite
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => navigate(`/manufacture?product=${product.id}`)}
                  className="w-full py-4 px-8 font-label text-xs uppercase tracking-widest border border-outline-variant hover:bg-surface-container-low transition-all duration-300 text-center"
                >
                  Запросить изготовление
                </button>

                {/* Преимущества */}
                <div className="pt-6 border-t border-outline-variant/30 space-y-4 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">local_shipping</span>
                    <span>Бесплатная доставка от 50 000 ₽</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">shield</span>
                    <span>Гарантия 2 года</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">exchange</span>
                    <span>Возврат 30 дней</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">verified</span>
                    <span>Сертификат подлинности</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Sets */}
        {productSets.length > 0 && (
          <section className="max-w-[1440px] mx-auto px-8 py-16 border-t border-outline-variant/20">
            <h2 className="font-headline text-2xl mb-8">Доступно в наборах</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productSets.map((set: Product) => (
                <Link
                  key={set.id}
                  to={`/set/${set.id}`}
                  className="p-6 bg-surface-container-low border border-outline-variant/20 hover:border-secondary transition-all duration-300 group"
                >
                  <h3 className="font-medium mb-2 group-hover:text-secondary transition-colors">{set.name}</h3>
                  <p className="text-secondary font-headline text-xl">{Number(set.price).toLocaleString('ru-RU')} ₽</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
