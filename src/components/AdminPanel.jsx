import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Save, Lock, LayoutDashboard } from 'lucide-react';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminSettings, setAdminSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { fetchSettings: refreshPublicSettings } = useSettings();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        fetchAdminSettings();
      } else {
        setMessage('Неверный логин или пароль');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Ошибка сервера при входе');
    }
  };

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/admin');
      if (response.ok) {
        const data = await response.json();
        setAdminSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin settings:', error);
      setMessage('Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, newValue) => {
    setAdminSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value: newValue } : setting
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: adminSettings }),
      });

      if (response.ok) {
        setMessage('Настройки сохранены успешно!');
        // Refresh public settings in context so the main site updates immediately
        refreshPublicSettings();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Lock className="text-primary w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Вход в админку</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Логин"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            {message && <p className="text-red-500 text-center">{message}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-slate-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <LayoutDashboard className="text-primary w-8 h-8" />
          <h1 className="text-3xl font-bold">Панель администратора</h1>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8">
          <div className="space-y-6">
            {adminSettings.map((setting) => (
              <div key={setting.key} className="grid md:grid-cols-3 gap-2 md:gap-4 items-start border-b border-slate-700/50 pb-6 last:border-0 last:pb-0">
                <div className="md:col-span-1">
                  <label className="block text-primary font-bold mb-1">{setting.key}</label>
                  <p className="text-slate-400 text-sm">{setting.description}</p>
                </div>
                <div className="md:col-span-2">
                  {(setting.key.includes('description') || setting.key.includes('keywords')) ? (
                    <textarea
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors resize-y"
                    />
                  ) : (
                    <input
                      type="text"
                      value={setting.value}
                      onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-lg ${message.includes('Ошибка') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center">
            <a href="/" className="text-slate-400 hover:text-primary transition-colors">← Вернуться на сайт</a>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
