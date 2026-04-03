import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import Footer from './Footer';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero слайды
  const heroSlides = [
    {
      title: 'Коллекция Сияние',
      subtitle: 'Изысканное искусство',
      description: 'Откройте для себя шедевр из редких драгоценных камней',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop',
      link: '/collections',
    },
    {
      title: 'Наследие',
      subtitle: 'Избранная коллекция',
      description: 'Дань уважения нашим истокам, переосмысленная для современности',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1920&h=1080&fit=crop',
      link: '/category/1',
    },
    {
      title: 'Знаковые работы',
      subtitle: 'Категории',
      description: 'Кураторские подборки от наших мастеров',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1920&h=1080&fit=crop',
      link: '/collections',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/products/?is_featured=true'),
          axios.get('http://localhost:8000/api/categories/'),
        ]);
        setFeaturedProducts(productsRes.data.results || productsRes.data);
        setCategories(categoriesRes.data.results || categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    // Автопереключение слайдов
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const getCategoryImage = (categoryName) => {
    const images = {
      'Кольца': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'Серьги': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'Браслеты': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'Кулоны': 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800',
      'Цепочки': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800',
      'Наборы': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    };
    return images[categoryName] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main>
        {/* Hero Carousel */}
        <section className="relative h-screen flex items-center bg-surface overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                className="w-full h-full object-cover"
                src={slide.image}
                alt={slide.title}
              />
              {/* Тёмное наложение для читаемости текста */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>
          ))}
          
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim font-medium mb-6 block">
                {heroSlides[currentSlide].subtitle}
              </span>
              <h1 className="serif-heading text-7xl md:text-8xl font-bold text-surface leading-[0.9] tracking-tighter mb-8">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="font-body text-lg text-surface/80 max-w-md mb-10 leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex items-center gap-10">
                <Link
                  to={heroSlides[currentSlide].link}
                  className="bg-secondary-fixed-dim text-on-primary px-10 py-5 text-sm uppercase tracking-widest font-bold hover:bg-secondary transition-all duration-500"
                >
                  Смотреть коллекцию
                </Link>
                <a
                  href="#appointment"
                  className="text-secondary-fixed-dim border-b border-secondary-fixed-dim/50 pb-1 text-sm uppercase tracking-widest font-bold hover:border-secondary-fixed-dim transition-all"
                >
                  Записаться на просмотр
                </a>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-secondary-fixed-dim w-8' : 'bg-surface/60'
                }`}
              />
            ))}
          </div>
        </section>

        {/* Categories Bento Grid */}
        <section className="py-32 bg-surface">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Категории</span>
                <h2 className="serif-heading text-5xl font-bold text-primary">Знаковые работы</h2>
              </div>
              <p className="max-w-xs text-on-surface-variant text-sm font-medium leading-relaxed opacity-60">
                ИЗБРАННЫЕ ИЗДЕЛИЯ ОТ НАШИХ МАСТЕРОВ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
              {categories.map((category, index) => {
                const colSpan = index === 0 ? 'md:col-span-2 md:row-span-2' : 
                               index === 1 ? 'md:col-span-2 md:row-span-1' : 
                               'md:col-span-1 md:row-span-1';
                
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className={`${colSpan} relative group overflow-hidden`}
                  >
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={getCategoryImage(category.name)}
                      alt={category.name}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                      <span className="text-white serif-heading text-3xl">{category.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* New Gallery Grid Block */}
        <section className="py-32 bg-surface">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Галерея</span>
              <h2 className="serif-heading text-5xl font-bold text-primary">Избранные коллекции</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 h-auto md:h-[900px]">
              {/* Large item - spans 2x2 */}
              <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200"
                  alt="Кольца"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                  <div>
                    <span className="text-white serif-heading text-3xl block mb-2">Кольца</span>
                    <Link to="/category/1" className="text-white text-sm uppercase tracking-widest border-b border-white pb-1 hover:border-secondary transition-colors">Смотреть коллекцию</Link>
                  </div>
                </div>
              </div>

              {/* Medium items */}
              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"
                  alt="Серьги"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    <span className="text-white serif-heading text-2xl block mb-2">Серьги</span>
                    <Link to="/category/2" className="text-white text-sm uppercase tracking-widest border-b border-white pb-1 hover:border-secondary transition-colors">Смотреть</Link>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600"
                  alt="Браслеты"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white serif-heading text-xl">Браслеты</span>
                </div>
              </div>

              <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=600"
                  alt="Кулоны"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white serif-heading text-xl">Кулоны</span>
                </div>
              </div>

              {/* Bottom row */}
              <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600"
                  alt="Цепочки"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white serif-heading text-xl">Цепочки</span>
                </div>
              </div>

              <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
                  alt="Наборы"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div>
                    <span className="text-white serif-heading text-2xl block mb-2">Наборы</span>
                    <Link to="/category/6" className="text-white text-sm uppercase tracking-widest border-b border-white pb-1 hover:border-secondary transition-colors">Смотреть</Link>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden bg-primary-container flex items-center justify-center p-6">
                <div className="text-center">
                  <span className="text-secondary-fixed-dim serif-heading text-2xl block mb-4">Индивидуальный заказ</span>
                  <Link to="#contact" className="text-secondary text-sm uppercase tracking-widest border-b border-secondary pb-1 hover:text-secondary-fixed-dim hover:border-secondary-fixed-dim transition-colors">Оставить заявку</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Избранное</span>
                <h2 className="serif-heading text-5xl font-bold text-primary">Новые поступления</h2>
              </div>
              <Link
                to="/collections"
                className="text-secondary border-b-2 border-secondary pb-1 font-bold tracking-widest text-sm uppercase hover:text-primary hover:border-primary transition-all duration-300"
              >
                Смотреть все
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="group">
                  <div className="mb-6 overflow-hidden">
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
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium group-hover:text-secondary transition-colors">{product.name}</h3>
                    {product.stone_type && (
                      <p className="text-[11px] uppercase tracking-widest text-on-surface-variant">{product.stone_type}</p>
                    )}
                    <p className="text-base font-medium">{Number(product.price).toLocaleString()} ₽</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-40 bg-primary-container text-surface">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="serif-heading text-6xl font-bold mb-10 leading-tight">
                  За гранью <br /> бриллианта
                </h2>
                <div className="space-y-6 opacity-80 font-body text-lg leading-relaxed max-w-lg">
                  <p>
                    Основанный на принципах тихой роскоши, LUXEJEWELS представляет вершину ювелирного мастерства. 
                    Каждый камень этически добыт и отобран вручную за его душу и характер.
                  </p>
                  <p>
                    Наши мастера проводят сотни часов над каждым изделием, гарантируя, что то, что касается вашей кожи — 
                    не просто украшение, а наследие человеческого прикосновения и художественного видения.
                  </p>
                </div>
                <div className="mt-12 flex gap-12 border-t border-surface/10 pt-12">
                  <div>
                    <span className="block text-3xl serif-heading font-bold text-secondary-fixed-dim">{featuredProducts.length}+</span>
                    <span className="text-xs uppercase tracking-widest opacity-60">Уникальных изделий</span>
                  </div>
                  <div>
                    <span className="block text-3xl serif-heading font-bold text-secondary-fixed-dim">2024</span>
                    <span className="text-xs uppercase tracking-widest opacity-60">Год основания</span>
                  </div>
                  <div>
                    <span className="block text-3xl serif-heading font-bold text-secondary-fixed-dim">0%</span>
                    <span className="text-xs uppercase tracking-widest opacity-60">Конфликтных источников</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-secondary/30"></div>
                <img
                  className="w-full grayscale brightness-75 contrast-125 shadow-2xl"
                  src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=1000&fit=crop"
                  alt="Мастер за работой"
                />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r border-b border-secondary/30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section id="contact" className="py-32 bg-surface-container">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-6 block">Присоединиться</span>
            <h2 className="serif-heading text-4xl font-bold text-primary mb-8">
              Приглашения на закрытые показы
            </h2>
            <p className="text-on-surface-variant mb-12">
              Будьте первыми, кто увидит эксклюзивные коллекции и специальные выпуски.
            </p>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                className="flex-grow bg-transparent border-b border-outline-variant focus:border-secondary outline-none py-4 uppercase text-xs tracking-widest px-2"
                placeholder="ВАШ EMAIL"
                type="email"
              />
              <button
                className="bg-primary text-on-primary px-12 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all"
                type="submit"
              >
                Подписаться
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
