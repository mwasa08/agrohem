import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = process.env.NODE_ENV === "production"
  ? "/tmp/plantai.json"
  : path.join(__dirname, "plantai.json");

const defaultData = { users: [], scans: [], reminders: [] };
const db = await JSONFilePreset(dbPath, defaultData);

// Seed demo account
const exists = db.data.users.find(u => u.email === "demo@plantai.app");
if (!exists) {
  db.data.users.push({ id: 1, name: "Demo User", email: "demo@plantai.app", password: "demo123", created_at: Date.now() });
  await db.write();
}

export default db;
