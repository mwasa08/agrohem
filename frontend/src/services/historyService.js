const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getEmail = () => {
  try {
    const raw = sessionStorage.getItem("session");
    return raw ? JSON.parse(raw).email : "guest";
  } catch { return "guest"; }
};

export const HistoryService = {
  async save(scanData) {
    const res = await fetch(`${BASE}/history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...scanData, userEmail: getEmail() }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to save scan");
    return data.id;
  },

  async getAll() {
    const res = await fetch(`${BASE}/history?userEmail=${getEmail()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch history");
    return data;
  },

  async delete(id) {
    await fetch(`${BASE}/history/${id}`, { method: "DELETE" }).catch(() => {});
  },

  async getStats() {
    const res = await fetch(`${BASE}/history/stats?userEmail=${getEmail()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch stats");
    return data;
  },
};
