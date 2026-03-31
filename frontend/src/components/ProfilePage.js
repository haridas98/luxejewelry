import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', email: '', address: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', address: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Загружаем данные пользователя
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setFormData({ 
        username: userData.username || '', 
        email: userData.email || '', 
        address: userData.address || '',
        password: '' 
      });
    }
  }, [navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { 
      ...user, 
      username: formData.username, 
      email: formData.email,
      address: formData.address 
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('Данные обновлены!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto flex-1">
        <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-12">Профиль</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Информация о пользователе */}
          <div className="lg:col-span-1">
            <div className="bg-surface-container-low p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <p className="text-sm text-on-surface-variant">{user.email}</p>
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Имя пользователя</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Адрес</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Город, улица, дом"
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Новый пароль</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Оставьте пустым для сохранения текущего"
                      className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-on-primary py-3 text-xs uppercase tracking-widest font-bold hover:bg-primary-container transition-all"
                    >
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 border border-outline-variant py-3 text-xs uppercase tracking-widest font-bold hover:bg-surface-container transition-all"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Email</p>
                    <p className="font-body">{user.email}</p>
                  </div>
                  {user.address && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-1">Адрес</p>
                      <p className="font-body">{user.address}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full border border-outline-variant py-3 text-xs uppercase tracking-widest font-bold hover:bg-surface-container transition-all mt-4"
                  >
                    Редактировать
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="w-full bg-secondary text-on-primary mt-4 py-3 text-xs uppercase tracking-widest font-bold hover:bg-secondary-fixed-dim transition-all"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* Заказы и избранное */}
          <div className="lg:col-span-2 space-y-12">
            {/* Избранное */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="serif-heading text-2xl font-bold">Избранное</h2>
                <Link to="/wishlist" className="text-secondary text-sm uppercase tracking-widest hover:text-primary transition-colors">
                  Смотреть все
                </Link>
              </div>
              <div className="bg-surface-container-low p-8 text-center">
                <Link to="/wishlist" className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-4xl mb-2">favorite</span>
                  <p className="font-body text-on-surface-variant">Перейти в избранное</p>
                </Link>
              </div>
            </div>

            {/* Корзина */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="serif-heading text-2xl font-bold">Корзина</h2>
                <Link to="/cart" className="text-secondary text-sm uppercase tracking-widest hover:text-primary transition-colors">
                  Смотреть корзину
                </Link>
              </div>
              <div className="bg-surface-container-low p-8 text-center">
                <Link to="/cart" className="text-secondary hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
                  <p className="font-body text-on-surface-variant">Перейти в корзину</p>
                </Link>
              </div>
            </div>

            {/* Заказы */}
            <div>
              <h2 className="serif-heading text-2xl font-bold mb-6">История заказов</h2>
              <div className="bg-surface-container-low p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">receipt_long</span>
                <p className="serif-heading text-lg mb-4">У вас пока нет заказов</p>
                <Link
                  to="/collections"
                  className="inline-block bg-primary text-on-primary px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
                >
                  Перейти в каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
