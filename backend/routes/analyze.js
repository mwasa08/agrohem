import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64 || !mimeType) return res.status(400).json({ error: "imageBase64 and mimeType are required" });

  try {
    const response = await fetch("https://api.plant.id/v3/health_assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANTID_API_KEY,
      },
      body: JSON.stringify({
        images: [`data:${mimeType};base64,${imageBase64}`],
        health: "all",
        classification_level: "species",
        details: [
          "common_names",
          "description",
          "treatment",
          "classification",
          "wiki_image"
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || "Plant.id API error" });
    }

    const data = await response.json();

    // Parse Plant.id response into our app format
    const classification = data.result?.classification?.suggestions?.[0];
    const disease = data.result?.disease?.suggestions?.[0];
    const isHealthy = data.result?.is_healthy?.binary ?? true;
    const healthProb = data.result?.is_healthy?.probability ?? 1;

    const result = {
      plantName: classification?.name || "Unknown Plant",
      scientificName: classification?.name || "",
      isHealthy: isHealthy,
      confidence: Math.round((classification?.probability || 0.8) * 100),
      disease: isHealthy ? null : (disease?.name || "Unknown Disease"),
      severity: isHealthy ? "none" : (healthProb < 0.3 ? "severe" : healthProb < 0.6 ? "moderate" : "mild"),
      symptoms: disease?.details?.description
        ? [disease.details.description.substring(0, 120)]
        : isHealthy ? ["Plant appears healthy"] : ["Disease symptoms detected"],
      treatments: disease?.details?.treatment?.chemical
        ? [
            disease.details.treatment.chemical.substring(0, 120),
            disease.details.treatment.biological?.substring(0, 120) || "Consult a local agronomist",
            disease.details.treatment.prevention?.substring(0, 120) || "Monitor plant regularly",
          ].filter(Boolean)
        : ["Monitor the plant regularly", "Ensure proper watering", "Check for pests"],
      careAdvice: [
        classification?.details?.description?.value?.substring(0, 120) || "Ensure adequate sunlight and water",
        "Remove affected leaves if any disease is present",
      ],
      description: isHealthy
        ? `This plant appears to be a ${classification?.name || "plant"} and looks healthy. Continue regular care.`
        : `This ${classification?.name || "plant"} shows signs of ${disease?.name || "disease"}. Treatment is recommended.`,
      urgency: isHealthy ? "low" : (healthProb < 0.3 ? "high" : "medium"),
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
