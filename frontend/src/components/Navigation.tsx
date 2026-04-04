import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import type { Category } from '../types';

const Navigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(apiEndpoint(ENDPOINTS.categories));
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();

        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/');
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/collections?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setMobileMenuOpen(false);
            setMobileSearchOpen(false);
        }
    };

    const goToProfile = () => {
        if (isAuthenticated) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20">
                <div className="flex justify-between items-center w-full px-4 md:px-8 py-3 md:py-4 max-w-[1440px] mx-auto">
                    {/* Logo */}
                    <div className="flex-1 flex justify-start">
                        <Link
                            to="/"
                            className="font-headline text-xl md:text-2xl tracking-tighter font-bold text-primary"
                        >
                            MIEL Jewelry
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex flex-1 justify-center items-center gap-8 mx-8">
                        <Link
                            to="/collections"
                            className={`font-headline uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 ${
                                location.pathname === '/collections'
                                    ? 'text-secondary border-b border-secondary pb-1'
                                    : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
                            }`}
                        >
                            Коллекции
                        </Link>
                        {/* О компании dropdown */}
                        <div className="relative group">
                            <button className={`font-headline uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 flex items-center gap-1 whitespace-nowrap ${
                                ['/about', '/craftsmanship', '/sustainability', '/contact'].includes(location.pathname)
                                    ? 'text-secondary border-b border-secondary pb-1'
                                    : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
                            }`}>
                                О компании
                                <span className="material-symbols-outlined text-xs">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-2 bg-surface-container-lowest shadow-xl border border-outline-variant/20 py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link to="/about" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    История бренда
                                </Link>
                                <Link to="/craftsmanship" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Мастерство
                                </Link>
                                <Link to="/sustainability" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Экология
                                </Link>
                                <Link to="/contact" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Контакты
                                </Link>
                            </div>
                        </div>
                        {/* Услуги dropdown */}
                        <div className="relative group">
                            <button className={`font-headline uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 flex items-center gap-1 whitespace-nowrap ${
                                ['/care', '/shipping', '/appointment'].includes(location.pathname)
                                    ? 'text-secondary border-b border-secondary pb-1'
                                    : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
                            }`}>
                                Услуги
                                <span className="material-symbols-outlined text-xs">expand_more</span>
                            </button>
                            <div className="absolute top-full left-0 mt-2 bg-surface-container-lowest shadow-xl border border-outline-variant/20 py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link to="/care" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Уход и очистка
                                </Link>
                                <Link to="/shipping" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Доставка и оплата
                                </Link>
                                <Link to="/appointment" className="block px-4 py-3 text-sm hover:bg-surface-container text-primary hover:text-secondary transition-colors">
                                    Запись на просмотр
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="w-full flex items-center border border-outline-variant focus-within:border-secondary transition-colors">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                placeholder="Поиск по названию или артикулу..."
                                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="px-4 py-2 text-secondary">
                                <span className="material-symbols-outlined text-lg">search</span>
                            </button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex-1 flex justify-end items-center gap-3 md:gap-4">
                        <button
                            onClick={goToProfile}
                            className="text-primary opacity-80 hover:opacity-100 transition-opacity flex items-center"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">account_circle</span>
                        </button>

                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden text-primary opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
                        </button>

                        <Link to="/cart" className="text-primary opacity-80 hover:opacity-100 transition-opacity relative">
                            <span className="material-symbols-outlined text-xl md:text-2xl">shopping_bag</span>
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        </Link>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-primary"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">menu</span>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <AnimatePresence>
                    {mobileSearchOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden border-t border-outline-variant/20 bg-surface px-4 py-3 overflow-hidden"
                        >
                            <form onSubmit={handleSearch} className="flex items-center border border-outline-variant">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск украшений..."
                                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                                    autoFocus
                                />
                                <button type="submit" className="px-4 py-2 text-secondary">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[60] bg-black/50"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-surface-container-lowest shadow-2xl z-[70] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="font-headline text-xl font-bold">Меню</span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-primary"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </motion.button>
                                </div>

                                <form onSubmit={handleSearch} className="mb-8">
                                    <div className="flex items-center border border-outline-variant">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск украшений..."
                                            className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
                                        />
                                        <button type="submit" className="px-4 py-3 text-secondary">
                                            <span className="material-symbols-outlined">search</span>
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-4 mb-8">
                                    <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Коллекции</h3>
                                    {/* Все украшения link */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0 }}
                                    >
                                        <Link
                                            to="/collections"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block font-headline text-lg text-secondary font-bold hover:opacity-80 transition-colors py-2"
                                        >
                                            Все украшения
                                        </Link>
                                    </motion.div>
                                    {categories.map((category: Category) => (
                                        <motion.div
                                            key={category.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * category.id }}
                                        >
                                            <Link
                                                to={`/category/${category.id}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block font-headline text-lg text-primary hover:text-secondary transition-colors py-2"
                                            >
                                                {category.name}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Информация</h3>
                                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">О компании</Link>
                                    <Link to="/care" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Уход за изделиями</Link>
                                    <Link to="/shipping" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Доставка и оплата</Link>
                                    <Link to="/appointment" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Запись на просмотр</Link>
                                </div>

                                <div className="mt-8 pt-8 border-t border-outline-variant">
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Профиль</Link>
                                            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Избранное</Link>
                                            <button
                                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                                className="w-full text-left py-3 text-secondary transition-colors"
                                            >
                                                Выйти
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-primary hover:text-secondary transition-colors">Войти</Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
