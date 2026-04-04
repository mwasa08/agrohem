import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/", (req, res) => {
  const { timestamp, imageData, imageName, result, userEmail } = req.body;
  if (!result) return res.status(400).json({ error: "Scan data required" });
  const ts = timestamp || Date.now();
  const id = `scan_${ts}`;
  db.prepare("INSERT OR REPLACE INTO scans (id, user_email, image_data, image_name, result, timestamp) VALUES (?, ?, ?, ?, ?, ?)")
    .run(id, userEmail || "guest", imageData || "", imageName || "", JSON.stringify(result), ts);
  res.json({ id });
});

router.get("/stats", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const weekMs = 7 * 24 * 3600 * 1000;
  const all = db.prepare("SELECT * FROM scans WHERE user_email = ?").all(userEmail).map(s => ({ ...s, result: JSON.parse(s.result) }));
  res.json({
    total:    all.length,
    healthy:  all.filter(s => s.result?.isHealthy).length,
    diseased: all.filter(s => s.result?.isHealthy === false).length,
    thisWeek: all.filter(s => Date.now() - s.timestamp < weekMs).length,
  });
});

router.get("/", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const all = db.prepare("SELECT * FROM scans WHERE user_email = ? ORDER BY timestamp DESC").all(userEmail);
  res.json(all.map(s => ({ id: s.id, imageData: s.image_data, imageName: s.image_name, timestamp: s.timestamp, result: JSON.parse(s.result) })));
});

router.delete("/:id", (req, res) => {
  const scan = db.prepare("SELECT * FROM scans WHERE id = ?").get(req.params.id);
  if (!scan) return res.status(404).json({ error: "Scan not found" });
  db.prepare("DELETE FROM scans WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;
