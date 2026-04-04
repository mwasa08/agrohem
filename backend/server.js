import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute   from "./routes/analyze.js";
import authRoute      from "./routes/auth.js";
import historyRoute   from "./routes/history.js";
import remindersRoute from "./routes/reminders.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://agrohem.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "20mb" }));

app.use("/api/analyze",   analyzeRoute);
app.use("/api/auth",      authRoute);
app.use("/api/history",   historyRoute);
app.use("/api/reminders", remindersRoute);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`PlantAI server running on http://localhost:${PORT}`));
