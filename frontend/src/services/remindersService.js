const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const getEmail = () => {
  try {
    const raw = sessionStorage.getItem("session");
    return raw ? JSON.parse(raw).email : "guest";
  } catch { return "guest"; }
};

export const RemindersService = {
  async add(plantName, note, remindAt) {
    const res = await fetch(`${BASE}/reminders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: getEmail(), plantName, note, remindAt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to add reminder");
    return data;
  },

  async getAll() {
    const res = await fetch(`${BASE}/reminders?userEmail=${getEmail()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch reminders");
    return data;
  },

  async delete(id) {
    await fetch(`${BASE}/reminders/${id}`, { method: "DELETE" }).catch(() => {});
  },
};
