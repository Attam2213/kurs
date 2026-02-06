import React from 'react';
import { Phone, Mail, MapPin, CarTaxiFront } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer id="contacts" className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary mb-4">
              <CarTaxiFront size={28} />
              <span className="text-xl font-bold text-white tracking-wider">КУРС-ДОМОЙ</span>
            </div>
            <p className="text-slate-400">
              Надежное междугороднее такси. Комфортные поездки по России и новым регионам 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Навигация</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-slate-400 hover:text-primary transition-colors">Главная</a></li>
              <li><a href="#features" className="text-slate-400 hover:text-primary transition-colors">Преимущества</a></li>
              <li><a href="#booking" className="text-slate-400 hover:text-primary transition-colors">Заказать такси</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400">
                <Phone className="text-primary shrink-0" size={20} />
                <div>
                  <a href={`tel:${settings.phone_number.replace(/\D/g, '')}`} className="block hover:text-white transition-colors">{settings.phone_number}</a>
                  <span className="text-xs text-slate-500">Круглосуточно</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="text-primary shrink-0" size={20} />
                <a href="mailto:info@kurs-domoy.ru" className="hover:text-white transition-colors">info@kurs-domoy.ru</a>
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="text-primary shrink-0" size={20} />
                <span>Работаем по всей России, ЛНР, ДНР и Запорожской области</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Мы принимаем</h4>
            <div className="flex gap-4">
               {/* Placeholders for payment icons */}
               <div className="h-10 w-16 bg-white/10 rounded flex items-center justify-center text-xs text-slate-400">VISA</div>
               <div className="h-10 w-16 bg-white/10 rounded flex items-center justify-center text-xs text-slate-400">MC</div>
               <div className="h-10 w-16 bg-white/10 rounded flex items-center justify-center text-xs text-slate-400">МИР</div>
               <div className="h-10 w-16 bg-white/10 rounded flex items-center justify-center text-xs text-slate-400">CASH</div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Курс-Домой. Все права защищены.</p>
          <p>Политика конфиденциальности</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
