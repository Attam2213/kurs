const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./database.cjs');

dotenv.config();

const app = express();
const PORT = 3000;

// Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Helper to get setting
const getSetting = (key) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row) => {
      if (err) reject(err);
      resolve(row ? row.value : null);
    });
  });
};

// API for Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const dbUsername = await getSetting('admin_username');
    const dbPassword = await getSetting('admin_password');

    // Fallback defaults if DB is empty for some reason, though seed should handle it
    const validUsername = dbUsername || '79001743535';
    const validPassword = dbPassword || '5054958Tn';

    if (username === validUsername && password === validPassword) {
      res.json({ success: true, token: 'dummy-token-for-now' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to get all public settings (links, phone)
app.get('/api/settings/public', (req, res) => {
  const publicKeys = ['max_link', 'telegram_link', 'phone_number', 'site_title', 'meta_description', 'meta_keywords'];
  const placeholders = publicKeys.map(() => '?').join(',');
  
  db.all(`SELECT key, value FROM settings WHERE key IN (${placeholders})`, publicKeys, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    res.json(settings);
  });
});

// API to get all settings (Admin only - protected by simple password in frontend for now)
app.get('/api/settings/admin', (req, res) => {
  db.all("SELECT * FROM settings", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API to update settings
app.post('/api/settings', (req, res) => {
  const { settings } = req.body; // Expect array of {key, value}
  
  if (!settings || !Array.isArray(settings)) {
    return res.status(400).json({ error: 'Invalid settings format' });
  }

  const stmt = db.prepare("UPDATE settings SET value = ? WHERE key = ?");
  
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    settings.forEach(setting => {
      stmt.run(setting.value, setting.key);
    });
    db.run("COMMIT", (err) => {
      if (err) {
        console.error('Transaction error:', err);
        res.status(500).json({ error: 'Failed to update settings' });
      } else {
        res.json({ success: true });
      }
    });
  });
  stmt.finalize();
});

app.post('/api/booking', async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    // Get credentials from DB
    const token = await getSetting('telegram_bot_token');
    const chatId = await getSetting('telegram_chat_id');

    // Fallback to env or mock if DB is empty (optional, but good for safety)
    const TELEGRAM_BOT_TOKEN = token || process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
    const TELEGRAM_CHAT_ID = chatId || process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE';

    const message = `
🚖 *Новый заказ такси!*

👤 *Имя:* ${name}
📱 *Телефон:* ${phone}

🕒 *Время заказа:* ${new Date().toLocaleString()}
  `;

    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || !TELEGRAM_BOT_TOKEN) {
      console.log('Mock sending to Telegram (Token missing):', message);
      return res.status(200).json({ success: true, message: 'Simulated success (configure token in Admin Panel)' });
    }

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
