import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';
import ProductImage from './ProductImage';

interface ProductInfo {
  id: number;
  name: string;
  price: string;
  image_url?: string;
  image?: string;
}

const ManufacturePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId) {
      fetchProductInfo(productId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProductInfo = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}/`);
      const data = await response.json();
      setProductInfo({
        id: data.id,
        name: data.name,
        price: Number(data.price).toLocaleString('ru-RU'),
        image_url: data.images?.[0]?.image_url,
        image: data.images?.[0]?.image,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would send the data to the backend
    console.log('Manufacture request submitted:', { ...formData, product: productInfo });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navigation />
        <main className="pt-24 pb-20 min-h-screen">
          <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center">
            <FadeIn>
              <span className="material-symbols-outlined text-6xl text-secondary mb-6">check_circle</span>
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Заявка отправлена</h1>
              <p className="text-on-surface-variant text-lg mb-8 max-w-md mx-auto">
                Спасибо за ваш запрос! Наши мастера свяжутся с вами в течение 1-2 рабочих дней для обсуждения деталей.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/collections')}
                  className="px-10 py-4 bg-primary text-on-primary text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Перейти в каталог
                </button>
                <button
                  onClick={() => { setSubmitted(false); setProductInfo(null); }}
                  className="px-10 py-4 border border-outline-variant text-xs uppercase tracking-widest hover:bg-surface-container-low transition-colors"
                >
                  Новая заявка
                </button>
              </div>
            </FadeIn>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="mb-10">
              <span className="text-secondary text-[10px] tracking-[0.2em] uppercase block mb-4">Индивидуальный заказ</span>
              <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">Запрос на изготовление</h1>
              <p className="text-on-surface-variant text-lg max-w-2xl">
                Заполните форму, и наши мастера свяжутся с вами для обсуждения деталей создания уникального украшения.
              </p>
            </div>
          </FadeIn>

          {/* Product Info */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
            </div>
          ) : productInfo ? (
            <FadeIn>
              <div className="mb-10 p-6 bg-surface-container-low border border-outline-variant/20">
                <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Выбранное изделие</h2>
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-surface-container-lowest overflow-hidden">
                    <ProductImage
                      src={productInfo.image_url || productInfo.image}
                      alt={productInfo.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">{productInfo.name}</h3>
                    <p className="text-secondary font-headline text-xl">{productInfo.price} ₽</p>
                    <button
                      onClick={() => setProductInfo(null)}
                      className="text-xs text-on-surface-variant hover:text-secondary mt-2 underline"
                    >
                      Убрать
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ) : null}

          {/* Form */}
          <FadeIn>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                  Пожелания
                </label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm resize-none"
                  placeholder="Опишите ваши пожелания: изменения в дизайне, материалы, размеры..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-5 text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                Отправить запрос
              </button>
            </form>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ManufacturePage;
