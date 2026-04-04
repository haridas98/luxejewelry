import React, { useState, ChangeEvent, FormEvent } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { FadeIn } from './animations';

interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: 'in-person' | 'online';
  message: string;
}

const AppointmentPage: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type: 'in-person',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert('Ваша заявка отправлена! Менеджер свяжется с вами в течение часа.');
    setFormData({ name: '', email: '', phone: '', date: '', time: '', type: 'in-person', message: '' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative h-[40vh] flex items-center bg-surface overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1920&h=1080&fit=crop"
              alt="Запись на просмотр"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-[1440px] mx-auto px-12 w-full">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] text-secondary-fixed-dim font-medium mb-6 block">
                Услуги
              </span>
              <h1 className="serif-heading text-5xl md:text-6xl font-bold text-surface leading-[0.9] tracking-tighter mb-6">
                Запись на просмотр
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <FadeIn>
          <section className="py-20 bg-surface">
            <div className="max-w-[1440px] mx-auto px-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="serif-heading text-3xl font-bold mb-8">Выберите удобный формат</h2>

                  <div className="space-y-6 mb-8">
                    <div className="bg-surface-container-low p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-secondary text-2xl">storefront</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Личный визит в салон</h3>
                          <p className="font-body text-on-surface-variant leading-relaxed">
                            Посетите наш салон в Москве. Профессиональный консультант поможет
                            подобрать идеальное украшение, проведёт презентацию коллекции.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 font-body text-on-surface-variant text-sm ml-16">
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Адрес: Москва, ул. Петровка, 12</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Время работы: ежедневно с 10:00 до 22:00</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Бесплатная парковка для клиентов</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Презентация коллекции шампанским</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-surface-container-low p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-secondary text-2xl">video_call</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-2">Онлайн-консультация</h3>
                          <p className="font-body text-on-surface-variant leading-relaxed">
                            Видеозвонок с персональным консультантом. Покажем украшения в деталях,
                            ответим на все вопросы, поможем с выбором размера.
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-2 font-body text-on-surface-variant text-sm ml-16">
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Удобно из любой точки мира</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Детальный показ украшений в HD-качестве</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Консультация по уходу и размеру</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check</span>
                          <span>Специальное предложение для онлайн-клиентов</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-primary-container text-surface p-6">
                    <h3 className="serif-heading text-xl font-bold mb-4">Контакты салона</h3>
                    <div className="space-y-3 font-body">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">location_on</span>
                        <span>Москва, ул. Петровка, 12</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">phone</span>
                        <span>+7 (495) 123-45-67</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">email</span>
                        <span>salon@luxejewels.ru</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed-dim">schedule</span>
                        <span>Ежедневно с 10:00 до 22:00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="serif-heading text-3xl font-bold mb-8">Записаться на просмотр</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                        Тип записи *
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: 'in-person' })}
                          className={`p-4 border text-center transition-colors ${
                            formData.type === 'in-person'
                              ? 'border-secondary bg-secondary/5'
                              : 'border-outline-variant hover:border-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined block mx-auto mb-2">storefront</span>
                          <span className="text-sm font-medium">В салон</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, type: 'online' })}
                          className={`p-4 border text-center transition-colors ${
                            formData.type === 'online'
                              ? 'border-secondary bg-secondary/5'
                              : 'border-outline-variant hover:border-secondary'
                          }`}
                        >
                          <span className="material-symbols-outlined block mx-auto mb-2">video_call</span>
                          <span className="text-sm font-medium">Онлайн</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                        placeholder="Иван Иванов"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Телефон *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                          placeholder="+7 (___) ___-__-__"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Желаемая дата
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                          Желаемое время
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2">
                        Комментарий
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-outline-variant focus:border-secondary outline-none px-4 py-4 text-sm h-32 resize-none"
                        placeholder="Какие украшения вас интересуют? Есть ли особые пожелания?"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary px-12 py-5 text-sm uppercase tracking-widest font-bold hover:bg-primary-container transition-all duration-500"
                    >
                      Записаться
                    </button>

                    <p className="text-xs text-on-surface-variant text-center">
                      Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
                    </p>
                  </form>
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

export default AppointmentPage;
