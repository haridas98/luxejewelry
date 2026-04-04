import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

const CarePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative h-[40vh] flex items-center bg-surface overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&h=1080&fit=crop"
              alt="Уход за украшенияшениями"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim font-medium mb-6 block">
                Услуги
              </span>
              <h1 className="serif-heading text-5xl md:text-6xl font-bold text-surface leading-[0.9] tracking-tighter mb-6">
                Уход и очистка <br />изделий
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <FadeIn>
          <section className="py-20 bg-surface">
            <div className="max-w-[1440px] mx-auto px-12">
              <div className="max-w-3xl">
                <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-12">
                  Правильный уход за ювелирными изделиями сохраняет их блеск и красоту на долгие годы.
                  Наши эксперты рекомендуют регулярную очистку и правильное хранение для поддержания
                  безупречного вида ваших украшений.
                </p>

                <h2 className="serif-heading text-3xl font-bold mb-8">Профессиональная очистка</h2>

                <div className="space-y-8 mb-12">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary text-2xl">water_drop</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Ультразвуковая очистка</h3>
                      <p className="font-body text-on-surface-variant leading-relaxed">
                        Профессиональный метод очистки с использованием ультразвуковых волн.
                        Эффективно удаляет загрязнения из труднодоступных мест. Не рекомендуется
                        для изделий с жемчугом, опалами и другими пористыми камнями.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary text-2xl">bubble_chart</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Паровая очистка</h3>
                      <p className="font-body text-on-surface-variant leading-relaxed">
                        Бережный метод с использованием горячего пара. Подходит для большинства
                        драгоценных камней и металлов. Удаляет жир и загрязнения, возвращая
                        изделиям первоначальный блеск.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary text-2xl">cleaning_services</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Химическая очистка</h3>
                      <p className="font-body text-on-surface-variant leading-relaxed">
                        Специальные растворы для удаления стойких загрязнений и окисления.
                        Проводится только профессионалами с соблюдением всех мер безопасности.
                      </p>
                    </div>
                  </div>
                </div>

                <h2 className="serif-heading text-3xl font-bold mb-8">Домашний уход</h2>

                <div className="bg-surface-container-low p-8 mb-12">
                  <h3 className="font-bold text-xl mb-6">Рекомендации по самостоятельной очистке:</h3>
                  <ul className="space-y-4 font-body text-on-surface-variant">
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                      <span>Используйте мягкую зубную щётку и тёплую мыльную воду для регулярной очистки</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                      <span>Промывайте изделия под тёплой проточной водой после очистки</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                      <span>Насухо протирайте мягкой безворсовой тканью</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                      <span>Храните изделия отдельно в мягких мешочках или шкатулках</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                      <span>Снимайте украшения перед контактом с водой, косметикой и бытовой химией</span>
                    </li>
                  </ul>
                </div>

                <h2 className="serif-heading text-3xl font-bold mb-8">Чего следует избегать</h2>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-600 text-lg">cancel</span>
                    <p className="font-body text-on-surface-variant">
                      <strong className="text-primary">Агрессивных химикатов</strong> — хлор, аммиак и другие агрессивные вещества могут повредить металлы и камни
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-600 text-lg">cancel</span>
                    <p className="font-body text-on-surface-variant">
                      <strong className="text-primary">Абразивных материалов</strong> — жёсткие щётки и чистящие средства могут поцарапать поверхность
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-600 text-lg">cancel</span>
                    <p className="font-body text-on-surface-variant">
                      <strong className="text-primary">Горячей воды</strong> — резкие перепады температур могут повредить некоторые камни
                    </p>
                  </div>
                  <div className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-600 text-lg">cancel</span>
                    <p className="font-body text-on-surface-variant">
                      <strong className="text-primary">Хранения вместе</strong> — изделия могут царапать друг друга при хранении в одной шкатулке
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* CTA */}
        <FadeIn>
          <section className="py-20 bg-primary-container text-surface">
            <div className="max-w-[1440px] mx-auto px-12 text-center">
              <h2 className="serif-heading text-4xl font-bold mb-6">Профессиональная очистка в нашем салоне</h2>
              <p className="font-body text-lg text-surface/80 max-w-2xl mx-auto mb-8">
                Запишитесь на бесплатную профессиональную очистку ваших украшений.
                Наши мастера бережно восстановят первоначальный блеск изделий.
              </p>
              <a
                href="/appointment"
                className="inline-block bg-secondary-fixed-dim text-on-primary px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-secondary transition-all"
              >
                Записаться
              </a>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </div>
  );
};

export default CarePage;
