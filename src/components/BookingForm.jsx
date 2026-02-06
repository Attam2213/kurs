import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, User, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const BookingForm = () => {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    phone: '',
    name: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
        setFormData({ phone: '', name: '' });
      } else {
        console.error('Failed to submit form');
        // Optional: Show error state
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="booking" className="py-20 px-4 bg-slate-800/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Заказать такси</h2>
          <p className="text-slate-400">Заполните форму, и мы свяжемся с вами в течение 5 минут</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 md:p-10 shadow-2xl"
        >
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Заявка принята!</h3>
              <p className="text-slate-400">Наш оператор свяжется с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Ваше имя</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Как к вам обращаться"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 ml-1">Телефон</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="md:col-span-2 w-full py-4 bg-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <span>Заказать такси</span>
                <Send size={20} />
              </button>

              <div className="md:col-span-2 flex flex-col md:flex-row items-center justify-center gap-4 mt-4 pt-6 border-t border-slate-700/50">
                <p className="text-slate-400 text-sm mb-2 md:mb-0">Или свяжитесь с нами:</p>
                <div className="flex flex-wrap justify-center gap-4 w-full md:w-auto">
                   <a 
                     href={`tel:${settings.phone_number.replace(/\D/g, '')}`}
                     className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold hover:bg-green-500/30 transition-all"
                   >
                     <Phone size={20} />
                     <span>Позвонить</span>
                   </a>
                   <a 
                     href={settings.max_link}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 text-red-500 border border-red-600/30 rounded-xl font-bold hover:bg-red-600/30 transition-all"
                   >
                     <div className="w-5 h-5 flex items-center justify-center font-bold border-2 border-current rounded-full text-[10px]">M</div>
                     <span>MAX</span>
                   </a>
                   <a 
                     href={settings.telegram_link}
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold hover:bg-blue-500/30 transition-all"
                   >
                     <Send size={20} />
                     <span>Telegram</span>
                   </a>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
