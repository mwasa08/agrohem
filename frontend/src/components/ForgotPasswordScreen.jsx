import { useState } from "react";
import { useTranslation } from "react-i18next";
import { s } from "../styles";
import { T } from "../tokens";
import { Field, BtnPrimary, Spinner, ErrorBanner } from "../ui/SharedUI";

const ForgotPasswordScreen = ({ goTo }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) { setError("Please enter your email"); return; }
    if (!email.includes("@")) { setError("Please enter a valid email"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000/api"}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (e) { setError("Failed to send reset email"); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen-enter" style={{ ...s.screen, paddingBottom: 40, overflowY: "auto" }}>
      <div style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center" }}>
        <button onClick={() => goTo("login")} style={s.iconBtn}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: T.text, marginLeft: 14 }}>{t("forgotPassword")}</h1>
      </div>

      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {!sent ? (
          <>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>🔑</div>
              <h3 style={{ color: T.text, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Reset your password</h3>
              <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6 }}>Enter your email address and we will send you a link to reset your password.</p>
            </div>
            <ErrorBanner msg={error} />
            <Field label={t("email")} type="email" placeholder="Enter your email" value={email} onChange={setEmail}
              icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            />
            <BtnPrimary onClick={handleReset} disabled={loading}>
              {loading ? <Spinner size={18} /> : "Send Reset Link"}
            </BtnPrimary>
          </>
        ) : (
          <div style={{ background: "rgba(62,207,106,0.06)", border: `1px solid rgba(62,207,106,0.25)`, borderRadius: T.radius, padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>📧</div>
            <h3 style={{ color: T.text, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Check your email</h3>
            <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>We sent a reset link to <strong style={{ color: T.text }}>{email}</strong>. Check your inbox and follow the instructions.</p>
            <BtnPrimary onClick={() => goTo("login")} style={{ width: "auto", padding: "12px 28px", fontSize: 14 }}>
              Back to Login
            </BtnPrimary>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
