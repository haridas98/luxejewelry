import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  image?: string;
  material?: string;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = cartItems.map((item: CartItem) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeFromCart = (id: number) => {
    const newCart = cartItems.filter((item: CartItem) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calculateTotal = (): number => {
    return cartItems.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    alert('Переход к оформлению заказа...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto flex-1">
        <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-12">Корзина</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_cart</span>
            <p className="serif-heading text-xl mb-4">Ваша корзина пуста</p>
            <Link
              to="/collections"
              className="inline-block bg-primary text-on-primary px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {cartItems.map((item: CartItem) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-6 p-6 bg-surface-container-low"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-variant flex-shrink-0">
                      <img
                        src={item.image_url || item.image || 'https://via.placeholder.com/400'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">{item.name}</h3>
                      <p className="text-sm text-on-surface-variant mb-4">{item.material}</p>
                      <p className="text-lg font-bold mb-4">{item.price.toLocaleString()} ₽</p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-outline-variant">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="px-4 py-2 font-body font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-surface-container-low p-6 md:p-8 sticky top-24">
                <h2 className="serif-heading text-xl font-bold mb-6">Итого</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Товары ({cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)} шт.):</span>
                    <span>{calculateTotal().toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Доставка:</span>
                    <span className="text-secondary">Бесплатно</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-6 border-t border-outline-variant/20 mb-6">
                  <span>Итого к оплате:</span>
                  <span>{calculateTotal().toLocaleString()} ₽</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500 mb-4"
                >
                  Оформить заказ
                </button>

                <div className="space-y-3 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">local_shipping</span>
                    <span>Бесплатная доставка от 50 000 ₽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">shield</span>
                    <span>Гарантия 2 года</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">exchange</span>
                    <span>Возврат 30 дней</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
