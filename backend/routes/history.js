import { Router } from "express";
import db from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  const { timestamp, imageData, imageName, result, userEmail } = req.body;
  if (!result) return res.status(400).json({ error: "Scan data required" });
  const ts = timestamp || Date.now();
  const id = `scan_${ts}`;
  const existing = db.data.scans.findIndex(s => s.id === id);
  const scan = { id, user_email: userEmail || "guest", image_data: imageData || "", image_name: imageName || "", result, timestamp: ts };
  if (existing >= 0) db.data.scans[existing] = scan;
  else db.data.scans.push(scan);
  await db.write();
  res.json({ id });
});

router.get("/stats", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const weekMs = 7 * 24 * 3600 * 1000;
  const all = db.data.scans.filter(s => s.user_email === userEmail);
  res.json({
    total:    all.length,
    healthy:  all.filter(s => s.result?.isHealthy).length,
    diseased: all.filter(s => s.result?.isHealthy === false).length,
    thisWeek: all.filter(s => Date.now() - s.timestamp < weekMs).length,
  });
});

router.get("/", (req, res) => {
  const userEmail = req.query.userEmail || "guest";
  const all = db.data.scans
    .filter(s => s.user_email === userEmail)
    .sort((a, b) => b.timestamp - a.timestamp)
    .map(s => ({ id: s.id, imageData: s.image_data, imageName: s.image_name, timestamp: s.timestamp, result: s.result }));
  res.json(all);
});

router.delete("/:id", async (req, res) => {
  const idx = db.data.scans.findIndex(s => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "Scan not found" });
  db.data.scans.splice(idx, 1);
  await db.write();
  res.json({ ok: true });
});

export default router;
