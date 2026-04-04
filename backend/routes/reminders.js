import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/", (req, res) => {
  const { userEmail, plantName, note, remindAt } = req.body;
  if (!userEmail || !plantName || !remindAt) return res.status(400).json({ error: "userEmail, plantName and remindAt are required" });
  const result = db.prepare("INSERT INTO reminders (user_email, plant_name, note, remind_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(userEmail, plantName, note || "", remindAt, Date.now());
  res.json({ id: result.lastInsertRowid });
});

router.get("/", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const reminders = db.prepare("SELECT * FROM reminders WHERE user_email = ? ORDER BY remind_at ASC").all(userEmail);
  res.json(reminders);
});

router.delete("/:id", (req, res) => {
  const reminder = db.prepare("SELECT * FROM reminders WHERE id = ?").get(req.params.id);
  if (!reminder) return res.status(404).json({ error: "Reminder not found" });
  db.prepare("DELETE FROM reminders WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
