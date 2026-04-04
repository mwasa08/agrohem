import { Router } from "express";
import { ANTHROPIC_MODEL, MAX_TOKENS, SYSTEM_PROMPT, USER_PROMPT } from "../config/prompts.js";

const router = Router();

router.post("/", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: "imageBase64 and mimeType are required" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: imageBase64 } },
          { type: "text", text: USER_PROMPT },
        ]}],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || "Anthropic API error" });
    }

    const data = await response.json();
    const raw  = data.content.map(b => b.text || "").join("").trim();

    let result;
    try { result = JSON.parse(raw); } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else return res.status(500).json({ error: "Could not parse AI response" });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
