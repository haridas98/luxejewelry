import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

const CraftsmanshipPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navigation />
      <main className="pt-24 pb-20 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <FadeIn>
            <div className="mb-16">
              <span className="text-secondary text-[10px] tracking-[0.2em] uppercase block mb-4">LuxeJewels</span>
              <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">Мастерство</h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                Каждое украшение — это результат сотен часов кропотливой ручной работы лучших ювелиров мира.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            <FadeIn>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">diamond</span>
                <h2 className="font-headline text-2xl mb-4">Ручная работа</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Каждое изделие создаётся вручную нашими мастерами с многолетним опытом. Мы используем традиционные техники ювелирного дела, передающиеся из поколения в поколение, сочетая их с современными технологиями для достижения безупречного результата.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">precision_manufacturing</span>
                <h2 className="font-headline text-2xl mb-4">Точность до микрона</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Наши ювелиры работают с точностью до микрона. Каждый камень устанавливается вручную, каждая деталь полируется до идеального блеска. Мы не идём на компромиссы в вопросах качества.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">workspace_premium</span>
                <h2 className="font-headline text-2xl mb-4">Контроль качества</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Каждое украшение проходит многоступенчатый контроль качества. Мы проверяем прочность закрепок, чистоту полировки и соответствие всех параметров заявленным стандартам.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="bg-surface-container-low p-8 md:p-12">
                <span className="material-symbols-outlined text-4xl text-secondary mb-6">auto_awesome</span>
                <h2 className="font-headline text-2xl mb-4">Индивидуальный подход</h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Мы создаём украшения на заказ, учитывая все пожелания клиента. От эскиза до готового изделия — каждый этап согласовывается с вами, чтобы результат превзошёл ожидания.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="bg-primary-container text-surface p-12 md:p-20 text-center">
              <h2 className="font-headline text-3xl md:text-4xl mb-6">Создаём шедевры с 2024 года</h2>
              <p className="text-surface/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                Наша мастерская объединяет лучших ювелиров, которые делятся страстью к совершенству. Каждое украшение — это не просто аксессуар, а произведение искусства, которое будет передаваться из поколения в поколение.
              </p>
              <a href="/appointment" className="inline-block bg-surface text-primary px-10 py-4 text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-colors">
                Записаться на просмотр
              </a>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CraftsmanshipPage;
