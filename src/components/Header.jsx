import React, { useState } from 'react';
import { Phone, Menu, X, CarTaxiFront } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Header = () => {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <CarTaxiFront size={32} />
          <span className="text-2xl font-bold text-white tracking-wider">КУРС-ДОМОЙ</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="hover:text-primary transition-colors">Главная</a>
          <a href="#features" className="hover:text-primary transition-colors">Преимущества</a>
          <a href="#booking" className="hover:text-primary transition-colors">Заказать</a>
          <a href="#contacts" className="hover:text-primary transition-colors">Контакты</a>
          
          <a href={`tel:${settings.phone_number.replace(/\D/g, '')}`} className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors">
            <Phone size={18} />
            <span>{settings.phone_number}</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white hover:text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 absolute w-full">
          <div className="flex flex-col p-4 gap-4">
            <a href="#home" className="hover:text-primary" onClick={() => setIsMenuOpen(false)}>Главная</a>
            <a href="#features" className="hover:text-primary" onClick={() => setIsMenuOpen(false)}>Преимущества</a>
            <a href="#booking" className="hover:text-primary" onClick={() => setIsMenuOpen(false)}>Заказать</a>
            <a href="#contacts" className="hover:text-primary" onClick={() => setIsMenuOpen(false)}>Контакты</a>
            <a href={`tel:${settings.phone_number.replace(/\D/g, '')}`} className="flex items-center gap-2 text-primary font-bold">
              <Phone size={18} />
              <span>{settings.phone_number}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
