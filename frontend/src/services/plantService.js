const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const PlantService = {
  async analyze(imageBase64, mimeType) {
    const res = await fetch(`${BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64, mimeType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
    return data;
  },
};
