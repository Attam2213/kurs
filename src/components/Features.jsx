import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Map, BadgeCheck, Car, Heart } from 'lucide-react';

const features = [
  {
    icon: <Clock size={32} />,
    title: "Круглосуточно 24/7",
    description: "Мы работаем без перерывов и выходных. Закажите такси в любое время дня и ночи."
  },
  {
    icon: <Shield size={32} />,
    title: "Безопасность",
    description: "Все автомобили проходят регулярный техосмотр, а водители — медицинский контроль."
  },
  {
    icon: <Map size={32} />,
    title: "Все направления",
    description: "Поездки по всей России, а также в ЛНР, ДНР и Запорожскую область без ограничений."
  },
  {
    icon: <BadgeCheck size={32} />,
    title: "Опытные водители",
    description: "Стаж вождения наших сотрудников от 5 лет. Вежливые и аккуратные профессионалы."
  },
  {
    icon: <Car size={32} />,
    title: "Комфорт",
    description: "Современные иномарки с кондиционером и чистым салоном для приятной поездки."
  },
  {
    icon: <Heart size={32} />,
    title: "Забота о клиенте",
    description: "Поможем с багажом, предоставим детское кресло и учтем ваши пожелания."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Мы предоставляем сервис высокого уровня по доступным ценам. Ваша безопасность и комфорт — наш приоритет.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-slate-800/30 border border-slate-700 hover:border-primary/50 transition-colors group"
            >
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
