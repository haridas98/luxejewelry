import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Layout = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

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
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="font-noto-serif text-2xl tracking-tighter font-bold text-primary uppercase"
          >
            LUXEJEWELS
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <Link
              to="/"
              className={`font-noto-serif uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 ${
                location.pathname === '/'
                  ? 'text-secondary border-b border-secondary pb-1'
                  : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`font-noto-serif uppercase tracking-[0.1em] text-xs font-medium transition-all duration-500 ${
                location.pathname === '/products'
                  ? 'text-secondary border-b border-secondary pb-1'
                  : 'text-primary opacity-80 hover:opacity-100 hover:text-secondary'
              }`}
            >
              Collections
            </Link>
            <a
              href="#about"
              className="font-noto-serif uppercase tracking-[0.1em] text-xs font-medium text-primary opacity-80 hover:opacity-100 hover:text-secondary transition-all duration-500"
            >
              Atelier
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button className="material-symbols-outlined text-on-surface hover:text-secondary transition-colors">
              search
            </button>
            <Link to="/cart" className="relative">
              <span className="material-symbols-outlined text-on-surface hover:text-secondary transition-colors">
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-8 max-w-[1440px] mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary-container text-surface py-20 px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <span className="font-noto-serif text-xl text-surface mb-4 block">LUXEJEWELS</span>
            <p className="text-surface/60 font-body text-sm leading-relaxed">
              Curating the world's most exceptional jewelry since 2024.
            </p>
          </div>
          <div>
            <h4 className="text-surface font-body text-xs font-bold tracking-widest uppercase mb-6">Collections</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="text-surface/60 hover:text-surface transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-surface font-body text-xs font-bold tracking-widest uppercase mb-6">The House</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Our Story</a></li>
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Craftsmanship</a></li>
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-surface font-body text-xs font-bold tracking-widest uppercase mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Bespoke</a></li>
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Care</a></li>
              <li><a href="#" className="text-surface/60 hover:text-surface transition-colors text-sm">Shipping</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto mt-12 pt-8 border-t border-surface/10 flex justify-between items-center text-[10px] uppercase tracking-widest text-surface/40">
          <span>© 2024 LUXEJEWELS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-surface transition-colors">Instagram</a>
            <a href="#" className="hover:text-surface transition-colors">Pinterest</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
