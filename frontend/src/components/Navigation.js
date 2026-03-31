import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                setCategories(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
        
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        
        // Load cart count
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUserMenuOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
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
        setUserMenuOpen(false);
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
                            LUXEJEWELS
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
                        <Link 
                            to="/about" 
                            className={`font-headline uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 ${
                                location.pathname === '/about' 
                                    ? 'text-secondary border-b border-secondary pb-1' 
                                    : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
                            }`}
                        >
                            О компании
                        </Link>
                        <Link 
                            to="/care" 
                            className={`font-headline uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 ${
                                location.pathname === '/care' 
                                    ? 'text-secondary border-b border-secondary pb-1' 
                                    : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
                            }`}
                        >
                            Услуги
                        </Link>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="w-full flex items-center border border-outline-variant focus-within:border-secondary transition-colors">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                        {/* Profile / Login */}
                        <button 
                            onClick={goToProfile}
                            className="text-primary opacity-80 hover:opacity-100 transition-opacity flex items-center"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">account_circle</span>
                        </button>
                        
                        {/* Mobile search button */}
                        <button 
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden text-primary opacity-80 hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">search</span>
                        </button>
                        
                        {/* Cart */}
                        <Link to="/cart" className="text-primary opacity-80 hover:opacity-100 transition-opacity relative">
                            <span className="material-symbols-outlined text-xl md:text-2xl">shopping_bag</span>
                            <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        </Link>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden text-primary"
                        >
                            <span className="material-symbols-outlined text-xl md:text-2xl">menu</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t border-outline-variant/20 bg-surface px-4 py-3">
                        <form onSubmit={handleSearch} className="flex items-center border border-outline-variant">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск украшений..."
                                className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                                autoFocus
                            />
                            <button type="submit" className="px-4 py-2 text-secondary">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </form>
                    </div>
                )}
            </nav>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Drawer */}
                <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-surface-container-lowest shadow-2xl transition-transform duration-300 ${
                    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-headline text-xl font-bold">Меню</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-primary">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="flex items-center border border-outline-variant">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск украшений..."
                                    className="flex-1 bg-transparent px-4 py-3 outline-none text-sm"
                                />
                                <button type="submit" className="px-4 py-3 text-secondary">
                                    <span className="material-symbols-outlined">search</span>
                                </button>
                            </div>
                        </form>

                        {/* Categories */}
                        <div className="space-y-4 mb-8">
                            <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Коллекции</h3>
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block font-headline text-lg text-primary hover:text-secondary transition-colors"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Additional Links */}
                        <div className="space-y-4">
                            <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Информация</h3>
                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-primary hover:text-secondary transition-colors"
                            >
                                О компании
                            </Link>
                            <Link
                                to="/care"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-primary hover:text-secondary transition-colors"
                            >
                                Уход за изделиями
                            </Link>
                            <Link
                                to="/shipping"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-primary hover:text-secondary transition-colors"
                            >
                                Доставка и оплата
                            </Link>
                            <Link
                                to="/appointment"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-3 text-primary hover:text-secondary transition-colors"
                            >
                                Запись на просмотр
                            </Link>
                        </div>

                        {/* Auth Links */}
                        <div className="mt-8 pt-8 border-t border-outline-variant">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-3 text-primary hover:text-secondary transition-colors"
                                    >
                                        Профиль
                                    </Link>
                                    <Link
                                        to="/wishlist"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-3 text-primary hover:text-secondary transition-colors"
                                    >
                                        Избранное
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        className="w-full text-left py-3 text-secondary transition-colors"
                                    >
                                        Выйти
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-3 text-primary hover:text-secondary transition-colors"
                                >
                                    Войти
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navigation;
