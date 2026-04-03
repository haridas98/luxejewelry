import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center bg-surface overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              className="w-full h-full object-cover grayscale-[30%]"
              src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1920&h=1080&fit=crop"
              alt="Мастер за работой"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/60 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-6 block">
                О компании
              </span>
              <h1 className="serif-heading text-6xl md:text-7xl font-bold text-primary leading-[0.9] tracking-tighter mb-8">
                История <br /> Бренда
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-md leading-relaxed">
                Основанный на принципах тихой роскоши, LUXEJEWELS представляет вершину ювелирного мастерства.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-32 bg-surface">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="serif-heading text-5xl font-bold mb-10 leading-tight">
                  За гранью <br /> бриллианта
                </h2>
                <div className="space-y-6 font-body text-lg leading-relaxed text-on-surface-variant">
                  <p>
                    Основанный в 2024 году, LUXEJEWELS представляет вершину ювелирного мастерства. 
                    Каждый камень этически добыт и отобран вручную за его душу и характер.
                  </p>
                  <p>
                    Наши мастера проводят сотни часов над каждым изделием, гарантируя, что то, что 
                    касается вашей кожи — не просто украшение, а наследие человеческого прикосновения 
                    и художественного видения.
                  </p>
                  <p>
                    Мы верим, что каждое украшение рассказывает историю — вашу историю. 
                    От первого свидания до юбилея, от выпускного до свадьбы — мы создаём 
                    спутников ваших самых важных моментов.
                  </p>
                </div>
                <div className="mt-12 flex gap-12 border-t border-outline-variant/30 pt-12">
                  <div>
                    <span className="block text-3xl serif-heading font-bold text-secondary-fixed-dim">169+</span>
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
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=1000&fit=crop"
                  alt="Ювелирные изделия"
                />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r border-b border-secondary/30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Мастерство */}
        <section id="craftsmanship" className="py-32 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Мастерство</span>
              <h2 className="serif-heading text-5xl font-bold text-primary">Искусство создания</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-secondary">auto_stories</span>
                </div>
                <h3 className="serif-heading text-2xl font-bold mb-4">Ручная работа</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Каждое изделие создаётся вручную нашими мастерами с многолетним опытом. 
                  От эскиза до готового изделия проходит от 2 до 4 недель кропотливой работы.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-secondary">diamond</span>
                </div>
                <h3 className="serif-heading text-2xl font-bold mb-4">Отборные камни</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Мы отбираем только лучшие камни по цвету, чистоте и огранке. 
                  Каждый камень проходит строгий контроль качества перед установкой.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 border-2 border-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-secondary">verified</span>
                </div>
                <h3 className="serif-heading text-2xl font-bold mb-4">Гарантия качества</h3>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Все изделия сертифицированы и имеют гарантию 2 года. 
                  Мы предоставляем пожизненное обслуживание наших украшений.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Экология */}
        <section id="sustainability" className="py-40 bg-primary-container text-surface">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="serif-heading text-5xl font-bold mb-10 leading-tight">
                  Ответственность <br /> перед планетой
                </h2>
                <div className="space-y-6 font-body text-lg leading-relaxed opacity-80">
                  <p>
                    Мы используем только этично добытое серебро и переработанные металлы. 
                    Все наши поставщики сертифицированы по международным стандартам.
                  </p>
                  <p>
                    Наша упаковка изготовлена из переработанных материалов и подлежит 
                    повторной переработке. Мы минимизируем углеродный след на каждом 
                    этапе производства.
                  </p>
                  <p>
                    Часть прибыли от каждой покупки направляется на поддержку программ 
                    по защите окружающей среды и восстановлению экосистем.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-secondary-fixed-dim/30"></div>
                <img
                  className="w-full brightness-90 contrast-110 shadow-2xl"
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=1000&fit=crop"
                  alt="Экологичность"
                />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 border-r border-b border-secondary-fixed-dim/30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Индивидуальный заказ */}
        <section id="bespoke" className="py-32 bg-surface">
          <div className="max-w-[1440px] mx-auto px-12 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-4 block">Индивидуальный заказ</span>
            <h2 className="serif-heading text-5xl font-bold text-primary mb-10">Создайте своё уникальное изделие</h2>
            <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto mb-12 leading-relaxed">
              Наши мастера воплотят вашу мечту в реальность. От эскиза до готового изделия — 
              мы сопроводим вас на каждом этапе создания уникального украшения.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-surface-container-low p-8">
                <h3 className="serif-heading text-xl font-bold mb-4">Консультация</h3>
                <p className="font-body text-on-surface-variant text-sm">Обсудим ваши пожелания и создадим эскиз</p>
              </div>
              <div className="bg-surface-container-low p-8">
                <h3 className="serif-heading text-xl font-bold mb-4">Изготовление</h3>
                <p className="font-body text-on-surface-variant text-sm">Создадим изделие в нашем ателье</p>
              </div>
              <div className="bg-surface-container-low p-8">
                <h3 className="serif-heading text-xl font-bold mb-4">Презентация</h3>
                <p className="font-body text-on-surface-variant text-sm">Покажем готовое изделие и вручим сертификат</p>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-block bg-primary text-on-primary px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
            >
              Оставить заявку
            </a>
          </div>
        </section>

        {/* Уход и доставка */}
        <section id="care" className="py-32 bg-surface-container-low">
          <div className="max-w-[1440px] mx-auto px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="serif-heading text-4xl font-bold mb-8">Уход за изделиями</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">cleaning_services</span>
                    <div>
                      <h3 className="font-bold mb-2">Очистка</h3>
                      <p className="font-body text-on-surface-variant text-sm">Используйте мягкую ткань и специальные средства для чистки серебра</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">water_drop</span>
                    <div>
                      <h3 className="font-bold mb-2">Хранение</h3>
                      <p className="font-body text-on-surface-variant text-sm">Храните изделия в сухом месте, в отдельном мешочке или шкатулке</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">warning</span>
                    <div>
                      <h3 className="font-bold mb-2">Предосторожности</h3>
                      <p className="font-body text-on-surface-variant text-sm">Снимайте украшения перед контактом с водой и химическими веществами</p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="shipping">
                <h2 className="serif-heading text-4xl font-bold mb-8">Доставка и оплата</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">local_shipping</span>
                    <div>
                      <h3 className="font-bold mb-2">Бесплатная доставка</h3>
                      <p className="font-body text-on-surface-variant text-sm">При заказе от 50 000 ₽ доставка по России бесплатно</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">credit_card</span>
                    <div>
                      <h3 className="font-bold mb-2">Способы оплаты</h3>
                      <p className="font-body text-on-surface-variant text-sm">Принимаем карты, банковские переводы и рассрочку</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-secondary">security</span>
                    <div>
                      <h3 className="font-bold mb-2">Гарантия</h3>
                      <p className="font-body text-on-surface-variant text-sm">2 года гарантии на все изделия, пожизненное обслуживание</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Контакты */}
        <section id="contact" className="py-32 bg-surface-container">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary mb-6 block">Контакты</span>
            <h2 className="serif-heading text-4xl font-bold text-primary mb-8">Свяжитесь с нами</h2>
            <p className="text-on-surface-variant mb-12">
              Запишитесь на просмотр или оставьте заявку на индивидуальное изделие
            </p>
            <div className="space-y-6 text-left mb-12">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <span className="font-body">Москва, ул. Петровка, 12</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">phone</span>
                <span className="font-body">+7 (495) 123-45-67</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">email</span>
                <span className="font-body">hello@luxejewels.ru</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">schedule</span>
                <span className="font-body">Ежедневно с 10:00 до 22:00</span>
              </div>
            </div>
            <form className="space-y-6">
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                placeholder="Ваше имя"
                type="text"
              />
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                placeholder="Email"
                type="email"
              />
              <textarea
                className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm h-32 resize-none"
                placeholder="Сообщение"
              />
              <button
                className="w-full bg-primary text-on-primary px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all"
                type="submit"
              >
                Отправить
              </button>
            </form>
          </div>
        </section>

        {/* Запись на просмотр */}
        <section id="appointment" className="py-32 bg-primary-container text-surface">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim mb-6 block">Запись на просмотр</span>
            <h2 className="serif-heading text-4xl font-bold mb-8">Посетите наш салон</h2>
            <p className="text-surface/80 mb-12">
              Запишитесь на персональную консультацию и просмотр коллекции в нашем салоне
            </p>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  className="w-full bg-surface/10 border border-surface/20 focus:border-secondary-fixed-dim outline-none px-4 py-4 text-sm"
                  placeholder="Ваше имя"
                  type="text"
                />
                <input
                  className="w-full bg-surface/10 border border-surface/20 focus:border-secondary-fixed-dim outline-none px-4 py-4 text-sm"
                  placeholder="Телефон"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  className="w-full bg-surface/10 border border-surface/20 focus:border-secondary-fixed-dim outline-none px-4 py-4 text-sm"
                  placeholder="Дата"
                  type="date"
                />
                <input
                  className="w-full bg-surface/10 border border-surface/20 focus:border-secondary-fixed-dim outline-none px-4 py-4 text-sm"
                  placeholder="Время"
                  type="time"
                />
              </div>
              <button
                className="w-full bg-secondary-fixed-dim text-on-primary px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-secondary transition-all"
                type="submit"
              >
                Записаться
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
