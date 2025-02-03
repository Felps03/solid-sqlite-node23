import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';

export const connectDB = () => {
  const db = new DatabaseSync(config.dbFile);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    ) STRICT
  `);

  return db;
};
