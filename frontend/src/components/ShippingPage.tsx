import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

const ShippingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative h-[40vh] flex items-center bg-surface overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop"
              alt="Доставка"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim font-medium mb-6 block">
                Услуги
              </span>
              <h1 className="serif-heading text-5xl md:text-6xl font-bold text-surface leading-[0.9] tracking-tighter mb-6">
                Доставка и оплата
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <FadeIn>
          <section className="py-20 bg-surface">
            <div className="max-w-[1440px] mx-auto px-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h2 className="serif-heading text-3xl font-bold mb-8">Доставка</h2>

                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">local_shipping</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">СДЭК</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Бесплатная доставка при заказе от 50 000 ₽. Срок доставки 3-7 дней
                          в зависимости от региона. Отслеживание заказа по трек-номеру.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">store</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Пункты выдачи</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Более 2000 пунктов выдачи СДЭК по всей России. Выберите удобный
                          пункт при оформлении заказа.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">home</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Курьерская доставка</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Доставка до двери в крупных городах. Стоимость рассчитывается
                          индивидуально в зависимости от адреса.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6">
                    <h3 className="font-bold text-lg mb-4">Стоимость доставки</h3>
                    <ul className="space-y-3 font-body text-on-surface-variant">
                      <li className="flex justify-between">
                        <span>Заказы до 50 000 ₽</span>
                        <span className="font-medium">от 350 ₽</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Заказы от 50 000 ₽</span>
                        <span className="font-medium text-secondary">Бесплатно</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Экспресс-доставка</span>
                        <span className="font-medium">от 1000 ₽</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="serif-heading text-3xl font-bold mb-8">Оплата</h2>

                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">credit_card</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Банковские карты</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Принимаем карты Visa, Mastercard, МИР. Оплата происходит через
                          защищённый шлюз банка-партнёра.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">account_balance</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Банковский перевод</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Для юридических лиц предоставляем счёт на оплату. Срок зачисления
                          средств 1-3 рабочих дня.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-secondary text-2xl">payments</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">Рассрочка</h3>
                        <p className="font-body text-on-surface-variant leading-relaxed">
                          Доступна рассрочка на заказы от 30 000 ₽. Срок рассрочки до 12 месяцев.
                          Оформление в салоне или онлайн.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-6">
                    <h3 className="font-bold text-lg mb-4">Гарантии безопасности</h3>
                    <ul className="space-y-3 font-body text-on-surface-variant">
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-secondary text-lg">verified</span>
                        <span>Все платежи защищены по стандарту PCI DSS</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-secondary text-lg">security</span>
                        <span>Данные карт не хранятся на наших серверах</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="material-symbols-outlined text-secondary text-lg">shield</span>
                        <span>Страхование всех отправлений на полную стоимость</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Возврат */}
        <FadeIn>
          <section className="py-20 bg-surface-container-low">
            <div className="max-w-[1440px] mx-auto px-12">
              <h2 className="serif-heading text-3xl font-bold mb-8 text-center">Возврат и обмен</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-surface p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">schedule</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">30 дней</h3>
                  <p className="font-body text-on-surface-variant text-sm">
                    На возврат товара надлежащего качества
                  </p>
                </div>
                <div className="bg-surface p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">receipt_long</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Документы</h3>
                  <p className="font-body text-on-surface-variant text-sm">
                    Сохраните чек и упаковку для возврата
                  </p>
                </div>
                <div className="bg-surface p-6 text-center">
                  <div className="w-16 h-16 bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">refund</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Возврат средств</h3>
                  <p className="font-body text-on-surface-variant text-sm">
                    В течение 10 дней после получения возврата
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPage;
