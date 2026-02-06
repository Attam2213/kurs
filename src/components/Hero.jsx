import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-primary text-sm font-medium">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            Работаем 24/7
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Комфортные поездки <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
              без границ
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl max-w-lg">
            Междугороднее такси по всей России, ЛНР, ДНР и Запорожской области. 
            Быстро, надежно и безопасно доставим вас домой.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a href="#booking" className="px-8 py-4 bg-primary text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg shadow-primary/20 text-center">
              Заказать такси
            </a>
            <a href="#features" className="px-8 py-4 bg-slate-800 text-white rounded-xl font-bold text-lg hover:bg-slate-700 transition-all border border-slate-700 text-center">
              Узнать подробнее
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/50">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white">24/7</h3>
              <p className="text-slate-400 text-sm">Круглосуточно</p>
            </div>
            <div className="text-center border-l border-slate-800/50">
              <h3 className="text-2xl font-bold text-white">100%</h3>
              <p className="text-slate-400 text-sm">Безопасность</p>
            </div>
            <div className="text-center border-l border-slate-800/50">
              <h3 className="text-2xl font-bold text-white">4+</h3>
              <p className="text-slate-400 text-sm">Региона</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="relative z-10 glass-panel p-8">
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Широкая география</h3>
                    <p className="text-slate-400">Россия, ЛНР, ДНР, Запорожье</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Подача в любое время</h3>
                    <p className="text-slate-400">Работаем без выходных и праздников</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg text-primary">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Надежные водители</h3>
                    <p className="text-slate-400">Опытные профессионалы за рулем</p>
                  </div>
                </div>
             </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
