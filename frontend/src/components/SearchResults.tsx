import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from './Layout';
import ProductImage from './ProductImage';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import type { Product, ProductImage as ProductImageType } from '../types';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(apiEndpoint(`/api/search/?q=${query}`));
        setResults(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query]);

  return (
    <Layout>
      <h1 className="text-5xl font-bold mb-12 serif-heading">Search: "{query}"</h1>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
          <p className="text-lg">No results found</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
        >
          {results.map((product: Product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <Link to={`/product/${product.id}`} className="group">
                <div className="mb-4 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <ProductImage
                      src={(product.images[0] as ProductImageType)?.image_url || (product.images[0] as ProductImageType)?.image}
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
                  <p className="text-secondary font-bold">{Number(product.price).toLocaleString()} ₽</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Layout>
  );
};

export default SearchResults;
