import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchWishlist(token);
  }, [navigate]);

  const fetchWishlist = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/api/wishlist/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://localhost:8000/api/wishlist/', {
        data: { product_id: productId },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlistItems(wishlistItems.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const addToCart = (product) => {
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
    navigate('/cart');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24 px-4 md:px-8 max-w-[1440px] mx-auto flex-1">
        <div className="mb-12">
          <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-4">Избранное</h1>
          <p className="text-on-surface-variant">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'товар' : wishlistItems.length < 5 ? 'товара' : 'товаров'} в избранном
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">favorite_border</span>
            <p className="serif-heading text-xl mb-4">Ваше избранное пусто</p>
            <Link
              to="/collections"
              className="inline-block bg-primary text-on-primary px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
            >
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden bg-surface-variant mb-4">
                  <Link to={`/product/${product.id}`}>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]?.image_url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full aspect-[4/5] object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
                      </div>
                    )}
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 bg-surface/80 backdrop-blur-sm hover:bg-secondary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">favorite</span>
                  </button>
                  {product.is_out_of_stock && (
                    <div className="absolute top-2 left-2 bg-primary-container text-surface text-[9px] uppercase tracking-widest px-2 py-1">
                      Нет в наличии
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-sm md:text-base font-medium group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  {product.stone_type && (
                    <p className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant line-clamp-1">{product.stone_type}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm md:text-base font-medium">{Number(product.price).toLocaleString()} ₽</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="text-secondary hover:text-primary transition-colors"
                      disabled={product.is_out_of_stock}
                    >
                      <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
