import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

const ContactPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="mb-16">
              <span className="text-secondary text-[10px] tracking-[0.2em] uppercase block mb-4">Свяжитесь с нами</span>
              <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">Контакты</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                Мы всегда рады помочь вам с выбором или ответить на любые вопросы.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <FadeIn>
              <div className="bg-surface-container-low p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">location_on</span>
                <h3 className="font-headline text-lg mb-2">Адрес шоурума</h3>
                <p className="text-on-surface-variant text-sm">г. Москва, ул. Тверская, д. 15, стр. 1</p>
                <p className="text-on-surface-variant text-sm">Метро «Тверская» / «Пушкинская»</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-surface-container-low p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">schedule</span>
                <h3 className="font-headline text-lg mb-2">Часы работы</h3>
                <p className="text-on-surface-variant text-sm">Пн — Пт: 10:00 — 21:00</p>
                <p className="text-on-surface-variant text-sm">Сб — Вс: 11:00 — 20:00</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-surface-container-low p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-secondary mb-4">call</span>
                <h3 className="font-headline text-lg mb-2">Телефон</h3>
                <p className="text-on-surface-variant text-sm">+7 (495) 123-45-67</p>
                <p className="text-on-surface-variant text-sm">info@Mieljewels.ru</p>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="font-headline text-2xl mb-6">Напишите нам</h2>
                <form className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Имя</label>
                    <input type="text" className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm" placeholder="Ваше имя" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Email</label>
                    <input type="email" className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">Сообщение</label>
                    <textarea rows={5} className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-3 text-sm resize-none" placeholder="Ваше сообщение..." />
                  </div>
                  <button type="submit" className="w-full bg-primary text-on-primary py-4 text-xs uppercase tracking-widest hover:bg-secondary transition-colors">
                    Отправить сообщение
                  </button>
                </form>
              </div>

              <div>
                <h2 className="font-headline text-2xl mb-6">Подписывайтесь</h2>
                <div className="space-y-4 mb-8">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-colors">
                    <span className="material-symbols-outlined text-secondary">photo_camera</span>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-xs text-on-surface-variant">@Mieljewels</p>
                    </div>
                  </a>
                  <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-colors">
                    <span className="material-symbols-outlined text-secondary">send</span>
                    <div>
                      <p className="font-medium">Telegram</p>
                      <p className="text-xs text-on-surface-variant">@Mieljewels</p>
                    </div>
                  </a>
                  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container-lowest transition-colors">
                    <span className="material-symbols-outlined text-secondary">pin</span>
                    <div>
                      <p className="font-medium">Pinterest</p>
                      <p className="text-xs text-on-surface-variant">MielJewels</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
