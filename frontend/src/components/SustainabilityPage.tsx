import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

const SustainabilityPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="mb-16">
              <span className="text-secondary text-[10px] tracking-[0.2em] uppercase block mb-4">Ответственность</span>
              <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">Экология</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                Мы стремимся к устойчивому развитию и ответственному отношению к природе на каждом этапе производства.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <FadeIn>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">recycling</span>
                <h2 className="font-headline text-2xl mb-4">Переработанные материалы</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Мы используем переработанное золото и серебро, сокращая потребность в новой добыче. До 80% наших металлов имеют сертификат переработанного происхождения.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">verified</span>
                <h2 className="font-headline text-2xl mb-4">Этичные камни</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Все наши бриллианты и драгоценные камни имеют сертификаты Kimberley Process и происходят из ответственных источников. Мы гарантируем отсутствие конфликтов в цепочке поставок.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">eco</span>
                <h2 className="font-headline text-2xl mb-4">Минимальный след</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Наша мастерская работает на возобновляемой энергии. Мы используем экологичную упаковку из переработанных материалов и минимизируем отходы производства.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">volunteer_activism</span>
                <h2 className="font-headline text-2xl mb-4">Социальная ответственность</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Мы поддерживаем местные сообщества и обеспечиваем справедливые условия труда на всех этапах производства. Часть прибыли направляется на экологические инициативы.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-12 md:p-20 text-center">
              <h2 className="font-headline text-3xl md:text-4xl mb-6">Наше обязательство</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed">
                К 2030 году мы планируем достичь 100% использования переработанных материалов и нулевого углеродного следа. Каждый шаг на этом пути — это инвестиция в будущее нашей планеты.
              </p>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SustainabilityPage;
