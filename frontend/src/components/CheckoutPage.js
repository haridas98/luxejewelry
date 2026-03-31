import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        comment: ''
    });

    const cartItems = [
        {
            id: 1,
            name: 'Вечность с Топазом',
            price: 2100,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Заказ оформлен! Менеджер свяжется с вами.');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="pt-24 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto">
                <div className="mb-12">
                    <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-4">Оформление заказа</h1>
                    <p className="text-on-surface-variant">Заполните форму для оформления заказа</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Форма заказа */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Контактная информация */}
                            <div className="bg-surface-container-low p-6 md:p-8">
                                <h2 className="serif-heading text-xl font-bold mb-6">Контактная информация</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Имя *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                            placeholder="Иван"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Фамилия *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                            placeholder="Иванов"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Телефон *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                            placeholder="+7 (999) 000-00-00"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Адрес доставки */}
                            <div className="bg-surface-container-low p-6 md:p-8">
                                <h2 className="serif-heading text-xl font-bold mb-6">Адрес доставки</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Адрес *
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                            placeholder="Улица, дом, квартира"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                                Город *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                                placeholder="Москва"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                                Индекс *
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                                                placeholder="101000"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                                            Комментарий к заказу
                                        </label>
                                        <textarea
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm h-24 resize-none"
                                            placeholder="Пожелания к доставке"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-on-primary py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
                            >
                                Оформить заказ
                            </button>
                        </form>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface-container-low p-6 md:p-8 sticky top-24">
                            <h2 className="serif-heading text-xl font-bold mb-6">Ваш заказ</h2>
                            
                            {/* Товары */}
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-outline-variant/20">
                                        <div className="w-20 h-20 bg-surface-variant flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                                            <p className="text-xs text-on-surface-variant mb-2">Кол-во: {item.quantity}</p>
                                            <p className="text-sm font-bold">{item.price.toLocaleString()} ₽</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Итого */}
                            <div className="space-y-3 pt-6 border-t border-outline-variant/20">
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Подытог</span>
                                    <span>{calculateTotal().toLocaleString()} ₽</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-on-surface-variant">Доставка</span>
                                    <span className="text-secondary">Бесплатно</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-outline-variant/20">
                                    <span>Итого</span>
                                    <span>{calculateTotal().toLocaleString()} ₽</span>
                                </div>
                            </div>

                            {/* Инфо */}
                            <div className="mt-6 space-y-3 text-xs text-on-surface-variant">
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
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
