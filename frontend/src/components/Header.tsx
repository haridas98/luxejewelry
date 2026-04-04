import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import type { Category } from '../types';

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(apiEndpoint(ENDPOINTS.categories));
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf9f6]/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-[1440px] mx-auto">
          {/* Desktop Navigation - Left */}
          <div className="flex-1 hidden md:flex gap-8 items-center">
            {categories.slice(0, 4).map((category: Category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="font-noto-serif uppercase tracking-[0.1em] text-xs font-medium text-[#775a19] border-b border-[#775a19] pb-1 transition-all duration-500"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-start md:justify-center">
            <Link
              to="/"
              className="font-noto-serif text-2xl tracking-tighter font-bold text-[#1a1a1a] dark:text-[#faf9f6]"
            >
              MIEL
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex-1 flex justify-end items-center gap-6">
            <button
              onClick={() => navigate('/search')}
              className="text-[#1a1a1a] dark:text-[#faf9f6] opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link
              to="/cart"
              className="text-[#1a1a1a] dark:text-[#faf9f6] opacity-80 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-[#1a1a1a] dark:text-[#faf9f6]"
            >
              <span className="material-symbols-outlined">menu</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] md:hidden bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-surface-container-lowest shadow-2xl z-[70] md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-noto-serif text-xl font-bold">Menu</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#1a1a1a]"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </motion.button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex items-center gap-2 border-b border-outline-variant">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-transparent py-3 outline-none text-sm"
                    />
                    <button type="submit" className="text-secondary">
                      <span className="material-symbols-outlined">search</span>
                    </button>
                  </div>
                </form>

                {/* Categories */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Collections</h3>
                  {categories.map((category: Category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * category.id }}
                    >
                      <Link
                        to={`/category/${category.id}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block font-noto-serif text-lg text-[#1a1a1a] hover:text-secondary transition-colors py-2"
                      >
                        {category.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Links */}
                <div className="mt-8 pt-8 border-t border-outline-variant">
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-[#1a1a1a] hover:text-secondary transition-colors"
                  >
                    All Pieces
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-[#1a1a1a] hover:text-secondary transition-colors"
                  >
                    Shopping Bag
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
