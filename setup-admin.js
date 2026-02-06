import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.sqlite');

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
  console.log('Usage: node setup-admin.js <username> <password>');
  process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value, description) VALUES (?, ?, ?)");
  
  stmt.run('admin_username', username, 'Admin Panel Username');
  stmt.run('admin_password', password, 'Admin Panel Password');
  
  stmt.finalize(() => {
    console.log(`Admin credentials updated: User=${username}`);
    db.close();
  });
});
