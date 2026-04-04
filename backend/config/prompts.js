export const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
export const MAX_TOKENS = 1000;

export const SYSTEM_PROMPT = `You are an expert plant pathologist and botanist with 20+ years of experience.
Analyze plant images and provide precise, actionable diagnoses.
ALWAYS respond with ONLY a raw JSON object — no markdown, no backticks, no preamble.`;

export const USER_PROMPT = `Examine this plant image carefully. Identify the plant species and assess its health status.
Return exactly this JSON structure with all fields populated:
{
  "plantName": "common name of the plant",
  "scientificName": "Latin binomial name",
  "isHealthy": true or false,
  "confidence": integer 60-97,
  "disease": "name of disease/condition, or null if perfectly healthy",
  "severity": "none" | "mild" | "moderate" | "severe",
  "symptoms": ["observed symptom 1", "observed symptom 2", "observed symptom 3"],
  "treatments": ["specific treatment step 1", "specific treatment step 2", "specific treatment step 3"],
  "careAdvice": ["care tip 1", "care tip 2"],
  "description": "Two-sentence summary of the plant current condition and what it needs.",
  "urgency": "low" | "medium" | "high"
}`;
