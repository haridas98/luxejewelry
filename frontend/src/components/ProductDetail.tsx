import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from './Layout';
import ProductImage from './ProductImage';
import { HoverCard } from './animations';
import { apiEndpoint, ENDPOINTS } from '../config/api';
import type { Product, ProductImage as ProductImageType } from '../types';

interface ExtendedProduct extends Product {
  stone_type?: string;
  category_name?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(apiEndpoint(`/api/products/${id}/`));
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Images */}
        <HoverCard>
          <div className="space-y-4">
            <div className="aspect-square bg-surface-variant overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <ProductImage
                    src={product.images[selectedImage]?.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-variant">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img: ProductImageType, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 border-2 transition-all ${
                      selectedImage === index ? 'border-secondary' : 'border-outline-variant hover:border-secondary'
                    }`}
                  >
                    <img src={(img as ProductImageType).image_url || (img as ProductImageType).image || 'https://via.placeholder.com/80'} alt="" className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </HoverCard>

        {/* Info */}
        <div className="py-8">
          <span className="label-md uppercase tracking-[0.15em] text-secondary mb-4 block">
            {product.category_name}
          </span>
          <h1 className="serif-heading text-5xl font-bold text-primary mb-6 leading-tight">
            {product.name}
          </h1>
          <p className="text-3xl text-secondary font-bold mb-8">
            {Number(product.price).toLocaleString()} ₽
          </p>
          <p className="font-body text-on-surface-variant leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-outline-variant/30 py-6 mb-8">
            <h3 className="label-md uppercase font-bold tracking-widest text-xs mb-6">Characteristics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.material && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant block mb-1">Material</span>
                  <span className="font-body">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant block mb-1">Weight</span>
                  <span className="font-body">{product.weight} g</span>
                </div>
              )}
              {product.stone_type && (
                <div>
                  <span className="text-xs uppercase tracking-widest text-on-surface-variant block mb-1">Stone</span>
                  <span className="font-body">{product.stone_type}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-on-primary px-8 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
            >
              Add to Bag
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-secondary text-secondary px-8 py-5 text-sm uppercase tracking-widest font-bold hover:bg-secondary hover:text-white transition-all duration-500"
            >
              Add to Wishlist
            </motion.button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
