const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const AuthService = {
  async login(email, password) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    sessionStorage.setItem("session", JSON.stringify(data.session));
    return data.session;
  },

  async signup(name, email, password) {
    const res = await fetch(`${BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    sessionStorage.setItem("session", JSON.stringify(data.session));
    return data.session;
  },

  async getSession() {
    try {
      const raw = sessionStorage.getItem("session");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  async logout() {
    sessionStorage.removeItem("session");
    await fetch(`${BASE}/auth/logout`, { method: "POST" }).catch(() => {});
  },

  async ensureDemoAccount() {},
};
