import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSettings } from '../context/SettingsContext';

const SEO = () => {
  const { settings } = useSettings();

  const title = settings.site_title || 'Курс-Домой | Междугороднее Такси 24/7';
  const description = settings.meta_description || 'Комфортабельное такси по России, ЛНР, ДНР и Запорожью. Работаем круглосуточно. Быстрая подача, выгодные цены.';
  const keywords = settings.meta_keywords || 'такси, межгород, ЛНР, ДНР, Запорожье, Россия, трансфер, поездки';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
