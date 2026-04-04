import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';
import ProductImage from './ProductImage';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import { FadeIn, StaggerContainer, StaggerItem } from './animations';
import type { Product, Category, Stone } from '../types';

type ExtendedProduct = Product & { stone_type?: string; created_at?: string };

const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: categoryId } = useParams<{ id: string }>();

  // States
  const [allProducts, setAllProducts] = useState<ExtendedProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [allStones, setAllStones] = useState<Stone[]>([]);
  const [allBrands, setAllBrands] = useState<{ id: number; name: string }[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState(() => {
    return localStorage.getItem('sortBy') || 'newest';
  });

  const sortOptions = [
    { value: 'newest', label: 'Сначала новые' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'name-asc', label: 'Название: А → Я' },
    { value: 'name-desc', label: 'Название: Я → А' },
  ];

  const currentSort = sortOptions.find(o => o.value === sortBy)?.label || 'Сначала новые';

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setSortOpen(false);
    if (sortOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [sortOpen]);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedStoneId, setSelectedStoneId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart.map((item: any) => item.id));
  }, []);

  // Load wishlist
  const fetchWishlist = async (token: string) => {
    try {
      const response = await axios.get(apiEndpoint(ENDPOINTS.wishlist), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data.map((p: Product) => p.id));
    } catch (error: any) {
      if (error.response && error.response.status !== 401) {
        console.error('Error fetching wishlist:', error);
      }
    }
  };

  // Toggle wishlist
  const toggleWishlist = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const isInWishlist = wishlist.includes(productId);
    try {
      if (isInWishlist) {
        await axios.delete(apiEndpoint(ENDPOINTS.wishlist), {
          data: { product_id: productId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id: number) => id !== productId));
      } else {
        await axios.post(
          apiEndpoint(ENDPOINTS.wishlist),
          { product_id: productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  // Add to cart — toggle: if in cart remove, if not add
  const addToCart = (e: React.MouseEvent, product: ExtendedProduct) => {
    e.stopPropagation();
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find((item: any) => item.id === product.id);

    let newCart: any[];
    if (existingItem) {
      newCart = existingCart.filter((item: any) => item.id !== product.id);
    } else {
      newCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(String(product.price)),
          image: product.images?.[0]?.image_url || product.images?.[0]?.image,
          material: product.material,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart.map((item: any) => item.id));
  };

  // Load data (products, categories, stones) + extract brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodsRes, catsRes, stonesRes] = await Promise.all([
          axios.get(apiEndpoint(ENDPOINTS.products + '?page_size=500')),
          axios.get(apiEndpoint(ENDPOINTS.categories)),
          axios.get(apiEndpoint(ENDPOINTS.stones)),
        ]);
        const products = prodsRes.data.results || prodsRes.data;
        setAllProducts(products);
        setCategories(catsRes.data.results || catsRes.data);
        setAllStones(stonesRes.data.results || stonesRes.data);

        // Extract unique brands
        const brandMap = new Map<number, string>();
        products.forEach((p: ExtendedProduct) => {
          if (p.brand && p.brand_name) {
            brandMap.set(p.brand, p.brand_name);
          }
        });
        setAllBrands(
          Array.from(brandMap.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name))
        );

        const params = new URLSearchParams(window.location.search);
        const search = params.get('search');
        if (search) {
          setCatalogSearch(search);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Available stones (only those present in current products)
  const availableStones = useMemo(() => {
    const stoneIds = new Set<number>();
    allProducts.forEach((p: ExtendedProduct) => {
      if (p.stones && p.stones.length > 0) {
        p.stones.forEach((s: Stone) => stoneIds.add(s.id));
      }
    });
    return allStones.filter((s: Stone) => stoneIds.has(s.id));
  }, [allProducts, allStones]);

  // Set current category
  useEffect(() => {
    if (categoryId) {
      const category = categories.find(
        (c: Category) => c.id === parseInt(categoryId)
      );
      setCurrentCategory(category || null);
    } else {
      setCurrentCategory(null);
    }
  }, [categoryId, categories]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product: ExtendedProduct) => {
      if (categoryId && Number(product.category) !== parseInt(categoryId))
        return false;
      if (
        selectedSubcategory &&
        product.subcategory !== parseInt(selectedSubcategory)
      )
        return false;
      if (
        selectedStoneId &&
        !product.stones?.some(
          (s: Stone) => s.id === parseInt(selectedStoneId)
        )
      )
        return false;
      if (selectedSize) {
        const sizes = String(product.ring_size || '').split(',').map(s => s.trim());
        if (!sizes.includes(selectedSize)) return false;
      }
      if (selectedBrand && Number(product.brand) !== parseInt(selectedBrand))
        return false;
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        const price = Number(product.price);
        if (max && (price < min || price > max)) return false;
        if (!max && price < min) return false;
      }
      if (catalogSearch) {
        const query = catalogSearch.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesArticle = product.article?.toLowerCase().includes(query);
        const matchesBrand = product.brand_name?.toLowerCase().includes(query);
        if (!matchesName && !matchesArticle && !matchesBrand) return false;
      }
      return true;
    });
  }, [
    allProducts,
    categoryId,
    selectedSubcategory,
    selectedStoneId,
    selectedSize,
    selectedBrand,
    priceRange,
    catalogSearch,
  ]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort(
      (a: ExtendedProduct, b: ExtendedProduct) => {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();

        switch (sortBy) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'name-asc':
            return nameA.localeCompare(nameB, 'ru');
          case 'name-desc':
            return nameB.localeCompare(nameA, 'ru');
          case 'newest':
          default:
            return (
              new Date(b.created_at || 0).getTime() -
              new Date(a.created_at || 0).getTime()
            );
        }
      }
    );
  }, [filteredProducts, sortBy]);

  // Update displayed products
  useEffect(() => {
    setDisplayedProducts(sortedProducts);
  }, [sortedProducts]);

  const clearFilters = () => {
    setSelectedSubcategory('');
    setSelectedStoneId('');
    setSelectedSize('');
    setSelectedBrand('');
    setPriceRange('');
  };

  const hasActiveFilters =
    selectedSubcategory || selectedStoneId || selectedSize || selectedBrand || priceRange;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24">
        {/* Mobile: Search + Filter Toggle */}
        <div className="md:hidden px-4 mb-4 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Поиск..."
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button type="submit" className="px-4 py-3 text-secondary">
              <span className="material-symbols-outlined text-lg">search</span>
            </button>
          </form>
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center justify-between w-full py-3 px-4 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm uppercase tracking-widest"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">filter_list</span>
              Фильтры
              {hasActiveFilters && (
                <span className="inline-flex items-center justify-center w-5 h-5 bg-secondary text-white text-[10px] rounded-full">
                  {[selectedSubcategory, selectedStoneId, selectedSize, selectedBrand, priceRange].filter(Boolean).length}
                </span>
              )}
            </span>
            <span className="material-symbols-outlined">
              {mobileFiltersOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Sidebar / Mobile Filters */}
          <aside
            className={`w-full md:w-64 flex-shrink-0 space-y-8 md:space-y-12 md:sticky md:top-24 md:self-start transition-all duration-300 overflow-hidden ${
              mobileFiltersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
            }`}
          >
            <FadeIn>
              <div>
                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                  Категории
                </h3>
                <ul className="space-y-4 text-sm">
                  <li
                    onClick={() => {
                      navigate('/collections');
                      setCurrentCategory(null);
                    }}
                    className={`flex justify-between items-center group cursor-pointer ${
                      !categoryId ? 'text-secondary font-medium' : ''
                    }`}
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      Все изделия
                    </span>
                    <span className="text-[10px] opacity-40">
                      {allProducts.length}
                    </span>
                  </li>
                  {categories.map((cat: Category) => (
                    <li
                      key={cat.id}
                      onClick={() => navigate(`/category/${cat.id}`)}
                      className={`flex justify-between items-center group cursor-pointer ${
                        categoryId === cat.id.toString()
                          ? 'text-secondary font-medium'
                          : ''
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">
                        {cat.name}
                      </span>
                      <span className="text-[10px] opacity-40">
                        {cat.products_count || 0}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Price Filter */}
            <FadeIn>
              <div>
                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                  Цена
                </h3>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-transparent border border-outline-variant focus:border-secondary outline-none px-3 py-2 text-sm"
                >
                  <option value="">Все цены</option>
                  <option value="0-15000">до 15 000 ₽</option>
                  <option value="15000-50000">15 000 — 50 000 ₽</option>
                  <option value="50000-100000">50 000 — 100 000 ₽</option>
                  <option value="100000-999999">от 100 000 ₽</option>
                </select>
              </div>
            </FadeIn>

            {/* Stone Filter */}
            <FadeIn>
              <div>
                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                  Камни
                </h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStoneId('')}
                    className={`px-3 py-2 text-xs border-2 transition-colors ${
                      selectedStoneId === ''
                        ? 'bg-secondary text-white border-secondary'
                        : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    Все
                  </button>
                  {availableStones.map((stone: Stone) => (
                    <button
                      key={stone.id}
                      onClick={() =>
                        setSelectedStoneId(
                          selectedStoneId === stone.id.toString()
                            ? ''
                            : stone.id.toString()
                        )
                      }
                      className={`px-3 py-2 text-xs border-2 transition-all flex items-center gap-2 ${
                        selectedStoneId === stone.id.toString()
                          ? 'border-secondary bg-secondary/10'
                          : 'border-outline-variant hover:border-secondary/50'
                      }`}
                      style={{
                        borderColor:
                          selectedStoneId === stone.id.toString()
                            ? stone.color || '#c4c7c7'
                            : '#c4c7c7',
                        backgroundColor:
                          selectedStoneId === stone.id.toString()
                            ? stone.color || 'transparent'
                            : 'transparent',
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stone.color }}
                      />
                      <span
                        style={{
                          color:
                            selectedStoneId === stone.id.toString()
                              ? '#fff'
                              : 'inherit',
                        }}
                      >
                        {stone.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Ring Size Filter */}
            {(categoryId === '21' || currentCategory?.name === 'Кольца') && (
              <FadeIn>
                <div>
                  <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                    Размер кольца
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20,
                    ].map((size: number) => (
                      <button
                        key={size}
                        onClick={() =>
                          setSelectedSize(
                            selectedSize === size.toString()
                              ? ''
                              : size.toString()
                          )
                        }
                        className={`px-3 py-2 text-xs border transition-colors ${
                          selectedSize === size.toString()
                            ? 'bg-secondary text-white border-secondary'
                            : 'border-outline-variant hover:border-secondary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Brand Filter */}
            {allBrands.length > 0 && (
              <FadeIn>
                <div>
                  <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                    Бренд
                  </h3>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-transparent border border-outline-variant focus:border-secondary outline-none px-3 py-2 text-sm"
                  >
                    <option value="">Все бренды</option>
                    {allBrands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              </FadeIn>
            )}

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
            <FadeIn>
              <header className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="max-w-2xl">
                    <span className="label-md uppercase text-secondary font-medium tracking-[0.2em] text-xs block mb-4">
                      {currentCategory
                        ? currentCategory.name
                        : 'Постоянная коллекция'}
                    </span>
                    <h1 className="serif-heading text-5xl md:text-7xl font-bold tracking-tight mb-6">
                      {currentCategory ? currentCategory.name : 'Все изделия'}
                    </h1>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-on-surface-variant">
                      {sortedProducts.length} {sortedProducts.length === 1 ? 'товар' : sortedProducts.length < 5 ? 'товара' : 'товаров'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg text-on-surface-variant">sort</span>
                      {/* Custom Sort Dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSortOpen(!sortOpen); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-on-surface border border-outline-variant hover:border-secondary transition-colors whitespace-nowrap"
                        >
                          {currentSort}
                          <span className="material-symbols-outlined text-xs transition-transform" style={{ transform: sortOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                            expand_more
                          </span>
                        </button>
                        {sortOpen && (
                          <div className="absolute right-0 top-full mt-1 bg-surface-container-lowest shadow-xl border border-outline-variant/20 py-1 min-w-[220px] z-50">
                            {sortOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSortBy(option.value);
                                  localStorage.setItem('sortBy', option.value);
                                  setSortOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container transition-colors ${
                                  sortBy === option.value
                                    ? 'text-secondary font-medium'
                                    : 'text-on-surface'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </header>
            </FadeIn>

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
                <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                  inventory_2
                </span>
                <p className="serif-heading text-xl mb-2">
                  Изделия не найдены
                </p>
                <button
                  onClick={clearFilters}
                  className="text-secondary border-b border-secondary/30 pb-1 text-sm uppercase tracking-widest font-bold hover:border-secondary transition-all"
                >
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  {displayedProducts.map((product: ExtendedProduct) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="group cursor-pointer"
                    >
                          <div
                            className="relative overflow-hidden bg-surface-variant mb-4"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            {product.images && product.images.length > 0 ? (
                              <ProductImage
                                className="w-full aspect-[4/5] object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                                src={product.images[0]?.image_url}
                                alt={product.name}
                              />
                            ) : (
                              <div className="w-full aspect-[4/5] bg-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                                  image
                                </span>
                              </div>
                            )}

                            {product.is_out_of_stock && (
                              <div className="absolute top-2 left-2 bg-primary-container text-surface text-[9px] uppercase tracking-widest px-2 py-1">
                                Нет в наличии
                              </div>
                            )}
                          </div>
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
                            {/* Price on left, icons on right */}
                            <div className="flex items-center justify-between pt-2">
                              <p className="text-sm md:text-base font-medium">
                                {Number(product.price).toLocaleString('ru-RU')} ₽
                              </p>
                              <div className="flex gap-2">
                                {/* Cart button - no circle, fills black when added */}
                                <button
                                  onClick={(e) => addToCart(e, product)}
                                  className="p-1 transition-all duration-200 hover:scale-110"
                                  disabled={product.is_out_of_stock}
                                  title={
                                    cart.includes(product.id)
                                      ? 'Убрать из корзины'
                                      : 'Добавить в корзину'
                                  }
                                >
                                  <span
                                    className="material-symbols-outlined text-xl transition-colors"
                                    style={
                                      cart.includes(product.id)
                                        ? { fontVariationSettings: "'FILL' 1", color: '#000' }
                                        : { fontVariationSettings: "'FILL' 0", color: '#444748' }
                                    }
                                  >
                                    shopping_cart
                                  </span>
                                </button>
                                {/* Wishlist button - no circle, fills black when added */}
                                <button
                                  onClick={(e) => toggleWishlist(e, product.id)}
                                  className="p-1 transition-all duration-200 hover:scale-110"
                                  title={
                                    wishlist.includes(product.id)
                                      ? 'Убрать из избранного'
                                      : 'В избранное'
                                  }
                                >
                                  <span
                                    className="material-symbols-outlined text-xl transition-colors"
                                    style={
                                      wishlist.includes(product.id)
                                        ? { fontVariationSettings: "'FILL' 1", color: '#000' }
                                        : { fontVariationSettings: "'FILL' 0", color: '#444748' }
                                    }
                                  >
                                    favorite
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </div>

      </main>
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </motion.button>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default CollectionsPage;
