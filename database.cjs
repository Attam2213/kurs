const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initDb();
  }
});

const initDb = () => {
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating table', err);
    } else {
      // Seed default values if not exists
      const defaults = [
        { key: 'telegram_bot_token', value: '', description: 'Telegram Bot Token' },
        { key: 'telegram_chat_id', value: '', description: 'Telegram Chat ID' },
        { key: 'max_link', value: 'https://max.ru/u/f9LHodD0cOJajaDo9TWKK4ezESdIENvmXG5lyqiZdcBVgrvLFHOIuTDZR2U', description: 'Link to MAX profile' },
        { key: 'telegram_link', value: 'https://t.me/Timoxa34rusz', description: 'Link to Telegram profile' },
        { key: 'phone_number', value: '+7 (999) 000-00-00', description: 'Contact Phone Number' },
        { key: 'admin_username', value: '79001743535', description: 'Admin Panel Username' },
        { key: 'admin_password', value: '5054958Tn', description: 'Admin Panel Password' },
        { key: 'site_title', value: 'Курс-Домой | Междугороднее Такси 24/7', description: 'SEO: Site Title' },
        { key: 'meta_description', value: 'Комфортабельное такси по России, ЛНР, ДНР и Запорожью. Работаем круглосуточно. Быстрая подача, выгодные цены.', description: 'SEO: Meta Description' },
        { key: 'meta_keywords', value: 'такси, межгород, ЛНР, ДНР, Запорожье, Россия, трансфер, поездки', description: 'SEO: Meta Keywords' }
      ];

      const stmt = db.prepare("INSERT OR IGNORE INTO settings (key, value, description) VALUES (?, ?, ?)");
      defaults.forEach(setting => {
        stmt.run(setting.key, setting.value, setting.description);
      });
      stmt.finalize();
    }
  });
};

module.exports = db;
