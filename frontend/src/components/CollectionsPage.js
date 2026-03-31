import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';

const CollectionsPage = () => {
    const navigate = useNavigate();
    const { id: categoryId } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [allStones, setAllStones] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filters
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedStoneId, setSelectedStoneId] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState('');
    
    // Wishlist
    const [wishlist, setWishlist] = useState([]);
    
    // Cart
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        if (token) {
            fetchWishlist(token);
        }
        
        // Load cart count
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загружаем ВСЕ товары для правильной фильтрации
                const [prodsRes, catsRes, stonesRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/products/?page_size=500'),
                    axios.get('http://localhost:8000/api/categories/'),
                    axios.get('http://localhost:8000/api/stones/'),
                ]);
                const allProducts = prodsRes.data.results || prodsRes.data;
                setAllProducts(allProducts);
                setCategories(catsRes.data.results || catsRes.data);
                setAllStones(stonesRes.data.results || stonesRes.data);
                
                // Проверка search параметра из URL
                const params = new URLSearchParams(window.location.search);
                const search = params.get('search');
                if (search) {
                    setSearchQuery(search);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Фильтруем камни - показываем только те, у которых есть товары
    const availableStones = useMemo(() => {
        const stoneIds = new Set();
        allProducts.forEach(p => {
            if (p.stones && p.stones.length > 0) {
                p.stones.forEach(s => stoneIds.add(s.id));
            }
        });
        return allStones.filter(s => stoneIds.has(s.id));
    }, [allProducts, allStones]);

    useEffect(() => {
        if (categoryId) {
            const category = categories.find(c => c.id === parseInt(categoryId));
            setCurrentCategory(category);
        } else {
            setCurrentCategory(null);
        }
    }, [categoryId, categories]);

    const fetchWishlist = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/wishlist/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setWishlist(response.data.map(p => p.id));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    const toggleWishlist = async (e, productId) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        const isInWishlist = wishlist.includes(productId);
        try {
            if (isInWishlist) {
                await axios.delete('http://localhost:8000/api/wishlist/', {
                    data: { product_id: productId },
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setWishlist(wishlist.filter(id => id !== productId));
            } else {
                await axios.post('http://localhost:8000/api/wishlist/',
                    { product_id: productId },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setWishlist([...wishlist, productId]);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    const addToCart = (e, product) => {
        e.stopPropagation();
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images?.[0]?.image_url,
                material: product.material,
                quantity: 1,
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Поиск уже обрабатывается в filteredProducts
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            if (categoryId && product.category !== parseInt(categoryId)) return false;
            if (selectedSubcategory && product.subcategory !== parseInt(selectedSubcategory)) return false;
            if (selectedStoneId && !product.stones?.some(s => s.id === parseInt(selectedStoneId))) return false;
            if (selectedSize && product.ring_size !== selectedSize) return false;
            if (priceRange) {
                const [min, max] = priceRange.split('-').map(Number);
                if (max && (product.price < min || product.price > max)) return false;
                if (!max && product.price < min) return false;
            }
            // Поиск по названию или артикулу
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesName = product.name.toLowerCase().includes(query);
                const matchesArticle = product.article?.toLowerCase().includes(query);
                if (!matchesName && !matchesArticle) return false;
            }
            return true;
        });
    }, [allProducts, categoryId, selectedSubcategory, selectedStoneId, selectedSize, priceRange, searchQuery]);

    // Sort products
    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }, [filteredProducts, sortBy]);

    useEffect(() => {
        setDisplayedProducts(sortedProducts);
    }, [sortedProducts]);

    // Clear all filters
    const clearFilters = () => {
        setSelectedSubcategory('');
        setSelectedStoneId('');
        setSelectedSize('');
        setPriceRange('');
    };

    const hasActiveFilters = selectedSubcategory || selectedStoneId || selectedSize || priceRange;

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="pt-24 pb-24">
                {/* Mobile Filter Toggle - sticky */}
                <div className="md:hidden sticky top-16 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/20 px-4 py-3">
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="flex items-center justify-between w-full py-2 text-sm uppercase tracking-widest"
                    >
                        <span>Фильтры {hasActiveFilters && `(${[selectedSubcategory, selectedStoneId, selectedSize, priceRange].filter(Boolean).length})`}</span>
                        <span className="material-symbols-outlined">{mobileFiltersOpen ? 'expand_less' : 'expand_more'}</span>
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 py-3 bg-surface border-b border-outline-variant/20">
                    <form onSubmit={handleSearch} className="flex items-center border border-outline-variant">
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

                <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8 md:gap-16">
                    {/* Sidebar - Desktop */}
                    <aside className={`w-full md:w-64 flex-shrink-0 space-y-8 md:space-y-12 md:sticky md:top-24 md:self-start ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
                        {/* Categories */}
                        <div>
                            <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">Категории</h3>
                            <ul className="space-y-4 text-sm">
                                <li 
                                    onClick={() => { navigate('/collections'); setCurrentCategory(null); }}
                                    className={`flex justify-between items-center group cursor-pointer ${!categoryId ? 'text-secondary font-medium' : ''}`}
                                >
                                    <span className="group-hover:translate-x-1 transition-transform">Все изделия</span>
                                    <span className="text-[10px] opacity-40">{allProducts.length}</span>
                                </li>
                                {categories.map((cat) => (
                                    <li 
                                        key={cat.id}
                                        onClick={() => navigate(`/category/${cat.id}`)}
                                        className={`flex justify-between items-center group cursor-pointer ${categoryId === cat.id.toString() ? 'text-secondary font-medium' : ''}`}
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                                        <span className="text-[10px] opacity-40">{cat.products_count || 0}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Stones Filter with Colors */}
                        <div>
                            <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">Камни</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedStoneId('')}
                                    className={`px-3 py-2 text-xs border transition-colors ${
                                        selectedStoneId === ''
                                            ? 'bg-secondary text-white border-secondary'
                                            : 'border-outline-variant hover:border-secondary'
                                    }`}
                                >
                                    Все
                                </button>
                                {availableStones.map(stone => (
                                    <button
                                        key={stone.id}
                                        onClick={() => setSelectedStoneId(selectedStoneId === stone.id.toString() ? '' : stone.id.toString())}
                                        className={`px-3 py-2 text-xs border transition-all flex items-center gap-2 ${
                                            selectedStoneId === stone.id.toString()
                                                ? 'ring-2 ring-secondary ring-offset-2'
                                                : 'hover:ring-2 hover:ring-secondary/50 hover:ring-offset-2'
                                        }`}
                                        style={{
                                            borderColor: selectedStoneId === stone.id.toString() ? stone.color : '#c4c7c7',
                                            backgroundColor: selectedStoneId === stone.id.toString() ? stone.color : 'transparent'
                                        }}
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: stone.color }}
                                        />
                                        <span style={{ color: selectedStoneId === stone.id.toString() ? '#fff' : 'inherit' }}>
                                            {stone.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ring Sizes - показываем для категории Колец */}
                        {(categoryId === '21' || currentCategory?.name === 'Кольца') && (
                            <div>
                                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">Размер кольца</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                            className={`px-3 py-2 text-xs border transition-colors ${
                                                selectedSize === size
                                                    ? 'bg-secondary text-white border-secondary'
                                                    : 'border-outline-variant hover:border-secondary'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Range */}
                        <div>
                            <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">Цена</h3>
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full bg-transparent border border-outline-variant focus:border-secondary outline-none px-3 py-2 text-sm"
                            >
                                <option value="">Все цены</option>
                                <option value="0-15000">до 15 000 ₽</option>
                                <option value="15000-50000">15 000 - 50 000 ₽</option>
                                <option value="50000-100000">50 000 - 100 000 ₽</option>
                                <option value="100000-999999">от 100 000 ₽</option>
                            </select>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full py-3 text-xs uppercase tracking-widest text-secondary border border-secondary hover:bg-secondary hover:text-white transition-colors"
                            >
                                Сбросить фильтры
                            </button>
                        )}
                    </aside>

                    {/* Products Grid */}
                    <section className="flex-1 min-w-0">
                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                                <div className="max-w-2xl">
                                    <span className="label-md uppercase text-secondary font-medium tracking-[0.2em] text-xs block mb-4">
                                        {currentCategory ? currentCategory.name : 'Постоянная коллекция'}
                                    </span>
                                    <h1 className="serif-heading text-5xl md:text-7xl font-bold tracking-tight mb-6">
                                        {currentCategory ? `${currentCategory.name}` : 'Все изделия'}
                                    </h1>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest border-b border-outline-variant/30 pb-2">
                                    <span className="text-on-surface-variant">Сортировка:</span>
                                    <button onClick={() => setSortBy('newest')} className={sortBy === 'newest' ? 'text-secondary' : 'hover:text-secondary transition-colors'}>Новые</button>
                                    <span className="text-outline-variant">/</span>
                                    <button onClick={() => setSortBy('price-asc')} className={sortBy === 'price-asc' ? 'text-secondary' : 'hover:text-secondary transition-colors'}>Цена</button>
                                </div>
                            </div>
                        </header>

                        <div className="mb-6 flex justify-between items-center">
                            <p className="text-sm text-on-surface-variant">
                                Показано {displayedProducts.length} из {allProducts.length}
                            </p>
                        </div>
                        
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                            </div>
                        ) : displayedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">inventory_2</span>
                                <p className="serif-heading text-xl mb-2">Изделия не найдены</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-secondary border-b border-secondary/30 pb-1 text-sm uppercase tracking-widest font-bold hover:border-secondary transition-all"
                                >
                                    Сбросить все фильтры
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                                {displayedProducts.map((product) => (
                                    <div 
                                        key={product.id} 
                                        className="group cursor-pointer"
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <div className="relative overflow-hidden bg-surface-variant mb-4">
                                            {product.images && product.images.length > 0 ? (
                                                <img 
                                                    className="w-full aspect-[4/5] object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000" 
                                                    src={product.images[0]?.image_url || 'https://via.placeholder.com/400'} 
                                                    alt={product.name} 
                                                />
                                            ) : (
                                                <div className="w-full aspect-[4/5] bg-surface-variant flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
                                                </div>
                                            )}
                                            
                                            {/* Wishlist Button - no background */}
                                            <button
                                                onClick={(e) => toggleWishlist(e, product.id)}
                                                className="absolute top-2 right-2 p-2 hover:scale-110 transition-transform"
                                            >
                                                <span className={`material-symbols-outlined text-2xl ${
                                                    wishlist.includes(product.id) 
                                                        ? 'text-secondary fill-secondary' 
                                                        : 'text-on-surface/60 hover:text-secondary'
                                                }`}>
                                                    {wishlist.includes(product.id) ? 'favorite' : 'favorite_border'}
                                                </span>
                                            </button>
                                            
                                            {product.is_out_of_stock && (
                                                <div className="absolute top-2 left-2 bg-primary-container text-surface text-[9px] uppercase tracking-widest px-2 py-1">
                                                    Нет в наличии
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-sm md:text-base font-medium group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h2>
                                            {product.stone_type && (
                                                <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant line-clamp-1">{product.stone_type}</p>
                                            )}
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm md:text-base font-medium">{Number(product.price).toLocaleString()} ₽</p>
                                                <button
                                                    onClick={(e) => addToCart(e, product)}
                                                    className="text-secondary hover:text-primary transition-colors p-1"
                                                    disabled={product.is_out_of_stock}
                                                >
                                                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CollectionsPage;
