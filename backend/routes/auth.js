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

router.post("/update", async (req, res) => {
  const { email, name, currentPassword, newPassword } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const idx = db.data.users.findIndex(u => u.email === email.toLowerCase());
  if (idx < 0) return res.status(404).json({ error: "User not found" });
  const user = db.data.users[idx];
  if (newPassword) {
    if (!currentPassword) return res.status(400).json({ error: "Current password required" });
    if (user.password !== currentPassword) return res.status(401).json({ error: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });
    db.data.users[idx].password = newPassword;
  }
  if (name) db.data.users[idx].name = name;
  await db.write();
  res.json({ session: { email: user.email, name: db.data.users[idx].name, loggedInAt: Date.now() } });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });
  const user = db.data.users.find(u => u.email === email.toLowerCase());
  if (!user) return res.status(404).json({ error: "No account found with this email" });
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expires = Date.now() + 3600000;
  if (!db.data.resetTokens) db.data.resetTokens = [];
  db.data.resetTokens = db.data.resetTokens.filter(t => t.email !== email.toLowerCase());
  db.data.resetTokens.push({ email: email.toLowerCase(), token, expires });
  await db.write();
  console.log(`Password reset token for ${email}: ${token}`);
  res.json({ ok: true, message: "Reset link sent" });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Token and new password required" });
  if (!db.data.resetTokens) return res.status(400).json({ error: "Invalid or expired token" });
  const resetEntry = db.data.resetTokens.find(t => t.token === token && t.expires > Date.now());
  if (!resetEntry) return res.status(400).json({ error: "Invalid or expired token" });
  const idx = db.data.users.findIndex(u => u.email === resetEntry.email);
  if (idx < 0) return res.status(404).json({ error: "User not found" });
  db.data.users[idx].password = newPassword;
  db.data.resetTokens = db.data.resetTokens.filter(t => t.token !== token);
  await db.write();
  res.json({ ok: true });
});

export default router;
