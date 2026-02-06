import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    max_link: 'https://max.ru/u/f9LHodD0cOJajaDo9TWKK4ezESdIENvmXG5lyqiZdcBVgrvLFHOIuTDZR2U',
    telegram_link: 'https://t.me/Timoxa34rusz',
    phone_number: '+7 (999) 000-00-00'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      console.log('🔄 Fetching settings from /api/settings/public...');
      const response = await fetch('/api/settings/public');
      console.log(`✅ Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Settings received:', data);
        setSettings(prev => ({ ...prev, ...data }));
      } else {
        const errorText = await response.text();
        console.error('❌ Settings fetch failed. Status:', response.status, 'Body:', errorText);
      }
    } catch (error) {
      console.error('🔥 Critical error in fetchSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
