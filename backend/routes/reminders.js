import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { userEmail, plantName, note, remindAt } = req.body;
  if (!userEmail || !plantName || !remindAt) return res.status(400).json({ error: "userEmail, plantName and remindAt are required" });
  const reminder = { id: Date.now(), user_email: userEmail, plant_name: plantName, note: note || "", remind_at: remindAt, created_at: Date.now() };
  db.data.reminders.push(reminder);
  await db.write();
  res.json({ id: reminder.id });
});

router.get("/", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const reminders = db.data.reminders
    .filter(r => r.user_email === userEmail)
    .sort((a, b) => a.remind_at - b.remind_at);
  res.json(reminders);
});

router.delete("/:id", async (req, res) => {
  const idx = db.data.reminders.findIndex(r => r.id === Number(req.params.id));
  if (idx < 0) return res.status(404).json({ error: "Reminder not found" });
  db.data.reminders.splice(idx, 1);
  await db.write();
  res.json({ ok: true });
});

export default router;
