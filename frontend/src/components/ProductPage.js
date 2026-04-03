import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [productSets, setProductSets] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);

    const fetchWishlist = async (token, productId) => {
        try {
            const response = await axios.get('http://localhost:8000/api/wishlist/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsInWishlist(response.data.some(p => p.id === productId));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Check if admin
            const payload = JSON.parse(atob(token.split('.')[1]));
            setIsAdmin(payload.is_staff || false);

            // Check wishlist
            fetchWishlist(token, parseInt(id));
        }
    }, [id]);

    const toggleWishlist = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        
        try {
            const response = await axios[isInWishlist ? 'delete' : 'post'](
                'http://localhost:8000/api/wishlist/',
                { product_id: parseInt(id) },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setIsInWishlist(!isInWishlist);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
                setProduct(response.data);
                if (response.data.sets && response.data.sets.length > 0) {
                    setProductSets(response.data.sets);
                }
                if (response.data.admin_info) {
                    // Admin info is available
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
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

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="pt-24 min-h-screen">
                <section className="max-w-[1440px] mx-auto px-8 py-12 lg:py-20 flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Images */}
                    <div className="lg:w-3/5 grid grid-cols-2 gap-4 h-fit">
                        <div className="col-span-2 aspect-[4/5] bg-surface-variant overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <img 
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                                    src={product.images[selectedImage]?.image || 'https://via.placeholder.com/800'} 
                                    alt={product.name} 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
                                </div>
                            )}
                        </div>
                        {product.images && product.images.slice(1, 3).map((img, idx) => (
                            <div 
                                key={idx} 
                                className={`aspect-square bg-surface-variant overflow-hidden cursor-pointer ${idx === 1 ? '' : 'mt-8'}`}
                                onClick={() => setSelectedImage(idx + 1)}
                            >
                                <img 
                                    className="w-full h-full object-cover" 
                                    src={img.image || 'https://via.placeholder.com/400'} 
                                    alt="" 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="lg:w-2/5 flex flex-col sticky top-32 h-fit">
                        <div className="mb-12">
                            <Link to={`/category/${product.category}`} className="text-secondary font-label text-[10px] tracking-[0.2em] uppercase block mb-4 hover:opacity-70 transition-opacity">
                                {product.category_name}
                            </Link>
                            <h1 className="serif-heading text-4xl md:text-5xl lg:text-6xl text-primary leading-tight -tracking-[0.02em] mb-6">
                                {product.name}
                            </h1>
                            <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-md">
                                {product.description}
                            </p>
                        </div>

                        {/* Admin Info - Hidden from regular users */}
                        {isAdmin && adminInfo && (
                            <div className="mb-8 p-6 bg-primary-container text-surface border border-secondary/30">
                                <p className="text-xs uppercase tracking-widest text-secondary-fixed-dim mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                                    Admin Panel
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Article</span>
                                        <span className="font-bold">{adminInfo.article || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Stock</span>
                                        <span className={`font-bold ${adminInfo.stock_quantity < 5 ? 'text-secondary-fixed-dim' : ''}`}>
                                            {adminInfo.stock_quantity} pcs
                                        </span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Cost</span>
                                        <span className="font-bold">{adminInfo.cost_price ? `${adminInfo.cost_price}` : 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">THB Price</span>
                                        <span className="font-bold">{adminInfo.price_thb ? `${adminInfo.price_thb} ฿` : 'N/A'}</span>
                                    </div>
                                    {product.weight && (
                                        <div>
                                            <span className="opacity-60 block text-[10px] uppercase tracking-widest">Weight</span>
                                            <span className="font-bold">{product.weight} g</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="opacity-60 block text-[10px] uppercase tracking-widest">Sold</span>
                                        <span className="font-bold">{adminInfo.sold_quantity || 0}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sets this product belongs to */}
                        {productSets.length > 0 && (
                            <div className="mb-8 p-6 bg-surface-container-low border border-outline-variant/20">
                                <p className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Also Available In Sets</p>
                                {productSets.map(set => (
                                    <Link
                                        key={set.id}
                                        to={`/set/${set.id}`}
                                        className="flex justify-between items-center py-3 border-t border-outline-variant/20 first:border-0 hover:text-secondary transition-colors"
                                    >
                                        <span className="font-medium">{set.name}</span>
                                        <span className="text-secondary">{Number(set.price).toLocaleString()} ₽</span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="space-y-12 mb-16">
                            <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
                                <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Investment</span>
                                <span className="serif-heading text-3xl text-primary">{Number(product.price).toLocaleString()} ₽</span>
                            </div>
                            <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                {product.material && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Material</span>
                                        <span className="serif-heading text-lg">{product.material}</span>
                                    </div>
                                )}
                                {product.weight && !isAdmin && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Weight</span>
                                        <span className="serif-heading text-lg">{product.weight} g</span>
                                    </div>
                                )}
                                {product.stone_type && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Stone</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {product.stones && product.stones.length > 0 ? (
                                                product.stones.map(stone => (
                                                    <span 
                                                        key={stone.id}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                                                        style={{ backgroundColor: stone.color + '20', color: stone.color }}
                                                    >
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stone.color }}></span>
                                                        {stone.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="serif-heading text-lg">{product.stone_type}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {product.ring_size && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Ring Size</span>
                                        <span className="serif-heading text-lg">{product.ring_size}</span>
                                    </div>
                                )}
                                {product.article && (
                                    <div className="flex flex-col gap-2">
                                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">Article</span>
                                        <span className="serif-heading text-lg">{product.article}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => navigate('/checkout')} 
                                className={`py-6 px-12 font-label text-xs uppercase tracking-widest transition-all duration-500 flex justify-between items-center group ${
                                    product.is_out_of_stock
                                        ? 'bg-outline-variant text-on-surface-variant cursor-not-allowed'
                                        : 'bg-primary text-on-primary hover:bg-primary-container'
                                }`}
                                disabled={product.is_out_of_stock}
                            >
                                {product.is_out_of_stock ? 'Нет в наличии' : 'Добавить в корзину'}
                                {!product.is_out_of_stock && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">shopping_bag</span>}
                            </button>
                            
                            {/* Wishlist Button */}
                            <button 
                                onClick={toggleWishlist}
                                className={`border py-6 px-12 font-label text-xs uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 ${
                                    isInWishlist
                                        ? 'border-secondary text-secondary bg-secondary/5'
                                        : 'border-outline-variant hover:bg-surface-container-low'
                                }`}
                            >
                                <span className={`material-symbols-outlined ${isInWishlist ? 'fill-secondary' : ''}`}>
                                    {isInWishlist ? 'favorite' : 'favorite_border'}
                                </span>
                                {isInWishlist ? 'В избранном' : 'В избранное'}
                            </button>
                            
                            <button className="border border-outline-variant py-6 px-12 font-label text-xs uppercase tracking-widest hover:bg-surface-container-low transition-all duration-500">
                                Запросить изготовление
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-12 pt-8 border-t border-outline-variant/30 space-y-4 text-sm text-on-surface-variant">
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
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default ProductPage;
