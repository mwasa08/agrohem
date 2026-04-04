import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use /tmp on Render (production) or local folder in development
const dbPath = process.env.NODE_ENV === "production"
  ? "/tmp/plantai.db"
  : path.join(__dirname, "plantai.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS scans (
    id TEXT PRIMARY KEY,
    user_email TEXT NOT NULL,
    image_data TEXT,
    image_name TEXT,
    result TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    plant_name TEXT NOT NULL,
    note TEXT,
    remind_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

const existing = db.prepare("SELECT * FROM users WHERE email = ?").get("demo@plantai.app");
if (!existing) {
  db.prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)")
    .run("Demo User", "demo@plantai.app", "demo123", Date.now());
}

export default db;
