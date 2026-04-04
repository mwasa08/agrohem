import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthService } from "../services/authService";
import { s } from "../styles";
import { T } from "../tokens";
import { Field, BtnPrimary, Spinner, ErrorBanner, BottomNav } from "../ui/SharedUI";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const ProfileScreen = ({ goTo, session, onSessionUpdate }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(session?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLang, setShowLang] = useState(false);

  const handleUpdate = async () => {
    if (!name) { setError("Name cannot be empty"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session?.email, name, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      const updated = { ...session, name };
      sessionStorage.setItem("session", JSON.stringify(updated));
      onSessionUpdate(updated);
      setSuccess("Profile updated successfully!");
      setCurrentPassword(""); setNewPassword("");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen-enter" style={s.screen}>
      {showLang && <LanguageSwitcher onClose={() => setShowLang(false)} />}

      <div style={{ ...s.pageHeader }}>
        <button onClick={() => goTo("home")} style={s.iconBtn}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: T.text }}>{t("profile")}</h1>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #16a34a, #3ecf6a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "white", marginBottom: 12, boxShadow: "0 0 24px rgba(62,207,106,0.3)" }}>
            {session?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: T.text }}>{session?.name}</p>
          <p style={{ fontSize: 13, color: T.textMuted }}>{session?.email}</p>
        </div>

        {/* Success */}
        {success && (
          <div style={{ background: "rgba(62,207,106,0.1)", border: `1px solid rgba(62,207,106,0.3)`, borderRadius: T.radiusSm, padding: "10px 14px", fontSize: 13, color: T.green }}>
            ✓ {success}
          </div>
        )}

        <ErrorBanner msg={error} />

        {/* Edit Name */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Edit Profile</h3>
          <Field label={t("fullName")} placeholder="Your name" value={name} onChange={setName} />
        </div>

        {/* Change Password */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>Change Password</h3>
          <Field label="Current Password" type="password" placeholder="Enter current password" value={currentPassword} onChange={setCurrentPassword} />
          <Field label="New Password" type="password" placeholder="Enter new password" value={newPassword} onChange={setNewPassword} />
        </div>

        <BtnPrimary onClick={handleUpdate} disabled={loading}>
          {loading ? <Spinner size={18} /> : "Save Changes"}
        </BtnPrimary>

        {/* Language */}
        <button onClick={() => setShowLang(true)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}>
          <span style={{ fontSize: 24 }}>🌍</span>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{t("language")}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>Change app language</div>
          </div>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth={2} strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>
        </button>

        {/* Logout */}
        <button onClick={async () => { await AuthService.logout(); goTo("login"); }} style={{ background: "rgba(245,101,101,0.08)", border: "1px solid rgba(245,101,101,0.2)", borderRadius: T.radius, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>🚪</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: T.red }}>{t("logout")}</span>
        </button>
      </div>

      <BottomNav screen="profile" goTo={goTo} />
    </div>
  );
};

export default ProfileScreen;
