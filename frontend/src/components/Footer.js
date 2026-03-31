import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary-container text-surface w-full pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 w-full mx-auto max-w-[1440px]">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1">
          <span className="font-headline text-xl text-surface mb-4 block">LUXEJEWELS</span>
          <p className="text-surface/60 font-body text-sm leading-relaxed max-w-xs">
            Исключительные ювелирные изделия с 2024 года. От наших мастеров к вашей коллекции.
          </p>
        </div>

        {/* Коллекции */}
        <div className="space-y-4">
          <h4 className="text-surface font-body text-sm font-bold tracking-widest uppercase mb-6">Коллекции</h4>
          <ul className="space-y-3">
            <li><Link to="/category/1" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Кольца</Link></li>
            <li><Link to="/category/2" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Серьги</Link></li>
            <li><Link to="/category/3" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Браслеты</Link></li>
            <li><Link to="/category/4" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Кулоны</Link></li>
            <li><Link to="/category/5" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Цепочки</Link></li>
            <li><Link to="/category/6" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Ожерелья</Link></li>
            <li><Link to="/category/7" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Наборы</Link></li>
          </ul>
        </div>

        {/* О компании */}
        <div className="space-y-4">
          <h4 className="text-surface font-body text-sm font-bold tracking-widest uppercase mb-6">О компании</h4>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">История бренда</Link></li>
            <li><Link to="/about#craftsmanship" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Мастерство</Link></li>
            <li><Link to="/about#sustainability" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Экология</Link></li>
            <li><Link to="/about#contact" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Контакты</Link></li>
          </ul>
        </div>

        {/* Услуги */}
        <div className="space-y-4">
          <h4 className="text-surface font-body text-sm font-bold tracking-widest uppercase mb-6">Услуги</h4>
          <ul className="space-y-3">
            <li><Link to="/care" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Уход и очистка</Link></li>
            <li><Link to="/shipping" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Доставка и оплата</Link></li>
            <li><Link to="/appointment" className="text-surface/60 hover:text-surface transition-colors duration-300 font-body text-sm tracking-wide">Запись на просмотр</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-12 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-surface/40 font-body text-xs tracking-widest uppercase">
          © 2024 LUXEJEWELS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.
        </span>
        <div className="flex gap-8">
          <a href="#" className="text-surface/40 hover:text-surface text-xs transition-colors">INSTAGRAM</a>
          <a href="#" className="text-surface/40 hover:text-surface text-xs transition-colors">PINTEREST</a>
          <a href="#" className="text-surface/40 hover:text-surface text-xs transition-colors">TELEGRAM</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
