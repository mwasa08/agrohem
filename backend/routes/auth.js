import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
  const key = email.toLowerCase();
  const existing = db.data.users.find(u => u.email === key);
  if (existing) return res.status(409).json({ error: "An account with this email already exists" });
  const user = { id: Date.now(), name, email: key, password, created_at: Date.now() };
  db.data.users.push(user);
  await db.write();
  res.json({ session: { email: key, name, loggedInAt: Date.now() } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find(u => u.email === email?.toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid email or password" });
  res.json({ session: { email: user.email, name: user.name, loggedInAt: Date.now() } });
});

router.post("/logout", (_req, res) => res.json({ ok: true }));

export default router;
