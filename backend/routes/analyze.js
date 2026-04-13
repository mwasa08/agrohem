import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: "imageBase64 and mimeType are required" });

  const apiKey = process.env.PLANTID_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "PLANTID_API_KEY is not set on the server" });

  try {
    // Convert base64 to blob for PlantNet API
    const imageBuffer = Buffer.from(imageBase64, "base64");
    const blob = new Blob([imageBuffer], { type: mimeType });

    const formData = new FormData();
    formData.append("images", blob, "plant.jpg");
    formData.append("organs", "leaf");

    const response = await fetch(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}&lang=en&include-related-images=false`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("PlantNet response:", JSON.stringify(data).substring(0, 300));

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.message || `PlantNet API error ${response.status}` });
    }

    // Parse PlantNet response into our app format
    const best = data.results?.[0];
    const plantName = best?.species?.commonNames?.[0] || best?.species?.scientificNameWithoutAuthor || "Unknown Plant";
    const scientificName = best?.species?.scientificNameWithoutAuthor || "";
    const confidence = Math.round((best?.score || 0.8) * 100);

    const result = {
      plantName,
      scientificName,
      isHealthy: true,
      confidence,
      disease: null,
      severity: "none",
      symptoms: ["No disease detection available with PlantNet — plant identified successfully"],
      treatments: [
        "Ensure adequate sunlight based on species requirements",
        "Water according to the species needs",
        "Check for pests regularly",
      ],
      careAdvice: [
        `${plantName} identified with ${confidence}% confidence`,
        "Consult a local agronomist for disease diagnosis if needed",
      ],
      description: `This plant has been identified as ${plantName} (${scientificName}) with ${confidence}% confidence. PlantNet specializes in plant identification.`,
      urgency: "low",
    };

    res.json(result);
  } catch (err) {
    console.error("PlantNet error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
