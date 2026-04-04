import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';
import { apiEndpoint, ENDPOINTS } from '../config/api';

interface UserData {
  username: string;
  email: string;
  address?: string;
  phone?: string;
}

interface FormData {
  username: string;
  email: string;
  address: string;
  phone: string;
  password: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData>({ username: '', email: '', address: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({ username: '', email: '', address: '', phone: '', password: '' });
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist'>('profile');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData: UserData = JSON.parse(savedUser);
      setUser(userData);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        address: userData.address || '',
        phone: userData.phone || '',
        password: ''
      });
    }

    // Считаем корзину
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);

    // Считаем избранное
    const authToken = localStorage.getItem('token');
    if (authToken) {
      // Для авторизованных — пробуем получить с API
      axios.get(apiEndpoint(ENDPOINTS.wishlist), {
        headers: { 'Authorization': `Bearer ${authToken}` }
      }).then(res => {
        const count = Array.isArray(res.data) ? res.data.length : 0;
        setWishlistCount(count);
      }).catch(() => {
        setWishlistCount(0);
      });
    } else {
      // Для неавторизованных — 0
      setWishlistCount(0);
    }
  }, [navigate]);

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    const updatedUser: UserData = {
      ...user,
      username: formData.username,
      email: formData.email,
      address: formData.address,
      phone: formData.phone,
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Профиль', icon: 'person' },
    { id: 'orders' as const, label: 'Заказы', icon: 'receipt_long' },
    { id: 'wishlist' as const, label: 'Избранное', icon: 'favorite' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          {/* Заголовок */}
          <FadeIn>
            <div className="mb-10">
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">Личный кабинет</h1>
              <p className="text-on-surface-variant">Добро пожаловать, <span className="text-primary font-medium">{user.username}</span></p>
            </div>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Боковая панель */}
            <FadeIn direction="right" delay={0.1}>
              <aside className="lg:w-72 flex-shrink-0">
                {/* Аватар и имя */}
                <div className="bg-surface-container-low p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center text-secondary text-xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-medium">{user.username}</h2>
                      <p className="text-xs text-on-surface-variant">{user.email}</p>
                    </div>
                  </div>

                  {/* Быстрая статистика */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <Link to="/cart" className="flex items-center gap-3 p-3 bg-surface-container-lowest hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-secondary text-xl">shopping_bag</span>
                      <div>
                        <p className="text-xs text-on-surface-variant">Корзина</p>
                        <p className="font-medium text-sm">{cartCount} товаров</p>
                      </div>
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 p-3 bg-surface-container-lowest hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-secondary text-xl">favorite</span>
                      <div>
                        <p className="text-xs text-on-surface-variant">Избранное</p>
                        <p className="font-medium text-sm">{wishlistCount} товаров</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Навигация */}
                <nav className="bg-surface-container-low p-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors mb-1 last:mb-0 ${
                        activeTab === tab.id
                          ? 'bg-secondary/10 text-secondary font-medium'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-outline-variant/20 pt-4"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Выйти
                  </button>
                </nav>
              </aside>
            </FadeIn>

            {/* Основной контент */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <FadeIn>
                  <div className="bg-surface-container-low">
                    <div className="flex justify-between items-center p-6 border-b border-outline-variant/20">
                      <h2 className="font-headline text-xl">Личные данные</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-xs uppercase tracking-widest text-secondary hover:opacity-80 transition-opacity flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          Изменить
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleUpdate} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Имя пользователя</label>
                            <input
                              type="text"
                              value={formData.username}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, username: e.target.value })}
                              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Телефон</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+7 (___) ___-__-__"
                              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Новый пароль</label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="Оставьте пустым"
                              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm transition-colors"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Адрес доставки</label>
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Город, улица, дом, квартира"
                              className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm transition-colors"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            className="flex-1 bg-primary text-on-primary py-4 text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                          >
                            Сохранить изменения
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-8 border border-outline-variant py-4 text-xs uppercase tracking-widest hover:bg-surface-container transition-colors"
                          >
                            Отмена
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 bg-surface-container-lowest">
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Имя пользователя</p>
                            <p className="font-medium">{user.username}</p>
                          </div>
                          <div className="p-4 bg-surface-container-lowest">
                            <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          {user.phone && (
                            <div className="p-4 bg-surface-container-lowest">
                              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Телефон</p>
                              <p className="font-medium">{user.phone}</p>
                            </div>
                          )}
                          {user.address && (
                            <div className="p-4 bg-surface-container-lowest md:col-span-2">
                              <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Адрес доставки</p>
                              <p className="font-medium">{user.address}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </FadeIn>
              )}

              {activeTab === 'orders' && (
                <FadeIn>
                  <div className="bg-surface-container-low p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">receipt_long</span>
                    <h3 className="font-headline text-2xl mb-2">Заказов пока нет</h3>
                    <p className="text-on-surface-variant mb-8">Оформите первый заказ — мы упакуем с любовью</p>
                    <Link
                      to="/collections"
                      className="inline-block bg-primary text-on-primary px-10 py-4 text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                    >
                      Перейти в каталог
                    </Link>
                  </div>
                </FadeIn>
              )}

              {activeTab === 'wishlist' && (
                <FadeIn>
                  <div className="bg-surface-container-low p-12 text-center">
                    <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">favorite</span>
                    <h3 className="font-headline text-2xl mb-2">Избранное пусто</h3>
                    <p className="text-on-surface-variant mb-8">Добавьте украшения, которые вам понравились</p>
                    <Link
                      to="/collections"
                      className="inline-block bg-primary text-on-primary px-10 py-4 text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                    >
                      Смотреть коллекции
                    </Link>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
