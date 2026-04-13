import { Router } from "express";
import { SYSTEM_PROMPT, USER_PROMPT } from "../config/prompts.js";

const router = Router();

router.post("/", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: "imageBase64 and mimeType are required" });

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-2-vision-latest",
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: USER_PROMPT,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || "Grok API error" });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || "";

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
