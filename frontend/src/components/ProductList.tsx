import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from './Layout';
import { StaggerContainer, StaggerItem } from './animations';
import ProductImage from './ProductImage';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import type { Product, Category } from '../types';

interface ExtendedProduct extends Product {
  category_name?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(apiEndpoint(ENDPOINTS.products)),
          axios.get(apiEndpoint(ENDPOINTS.categories)),
        ]);
        setProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? products.filter((p: ExtendedProduct) => Number(p.category) === parseInt(selectedCategory))
      : products;
  }, [products, selectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a: ExtendedProduct, b: ExtendedProduct) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });
  }, [filteredProducts, sortBy]);

  return (
    <Layout>
      <StaggerContainer>
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="label-md uppercase text-secondary font-medium tracking-[0.2em] text-xs block mb-4">
                The Permanent Collection
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 serif-heading">
                Celestial Artifacts
              </h1>
              <p className="text-body-lg text-on-surface-variant font-light leading-relaxed max-w-lg">
                Inspired by the mathematical precision of the cosmos. Each piece is hand-carved in our Parisian atelier using reclaimed gold and ethically sourced stones.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant">Sort by:</span>
              <button
                onClick={() => setSortBy('newest')}
                className={sortBy === 'newest' ? 'text-secondary' : 'hover:text-secondary transition-colors'}
              >
                Newest
              </button>
              <span className="text-outline-variant">/</span>
              <button
                onClick={() => setSortBy('price-asc')}
                className={sortBy === 'price-asc' ? 'text-secondary' : 'hover:text-secondary transition-colors'}
              >
                Price
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-16">
          <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
            <StaggerItem>
              <div>
                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                  Category
                </h3>
                <ul className="space-y-4 text-sm">
                  <li>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`flex justify-between items-center group w-full ${
                        selectedCategory === '' ? 'text-secondary font-medium' : ''
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform">All Objects</span>
                      <span className="text-[10px] opacity-40">{products.length}</span>
                    </button>
                  </li>
                  {categories.map((cat: Category) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setSelectedCategory(cat.id.toString())}
                        className={`flex justify-between items-center group w-full ${
                          selectedCategory === cat.id.toString() ? 'text-secondary font-medium' : ''
                        }`}
                      >
                        <span className="group-hover:translate-x-1 transition-transform">{cat.name}</span>
                        <span className="text-[10px] opacity-40">{cat.products_count || 0}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div>
                <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6 pb-2 border-b border-outline-variant/20">
                  Material
                </h3>
                <div className="space-y-3">
                  {['Золото 585', 'Золото 750', 'Серебро 925', 'Платина 950'].map((material) => (
                    <label key={material} className="flex items-center group cursor-pointer">
                      <input
                        className="w-4 h-4 border-outline-variant rounded-none checked:bg-secondary focus:ring-0 mr-3"
                        type="checkbox"
                      />
                      <span className="text-sm opacity-80 group-hover:opacity-100 transition-opacity">{material}</span>
                    </label>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {sortedProducts.map((product: ExtendedProduct) => (
                    <StaggerItem key={product.id}>
                      <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="group">
                        <Link to={`/product/${product.id}`}>
                          <div className="mb-4 overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <ProductImage
                                src={product.images[0]?.image_url}
                                alt={product.name}
                                className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full aspect-square bg-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-on-surface-variant">image</span>
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="serif-heading text-lg font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-on-surface-variant mb-1">{product.category_name}</p>
                            <p className="text-secondary font-bold">{Number(product.price).toLocaleString()} ₽</p>
                          </div>
                        </Link>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </div>
              </StaggerContainer>
            )}
          </div>
        </div>
      </StaggerContainer>
    </Layout>
  );
};

export default ProductList;
