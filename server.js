import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze.js";
import authRoute    from "./routes/auth.js";
import historyRoute from "./routes/history.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20mb" })); // allow large base64 image payloads

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/analyze", analyzeRoute);
app.use("/api/auth",    authRoute);
app.use("/api/history", historyRoute);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`PlantAI server running on http://localhost:${PORT}`));
