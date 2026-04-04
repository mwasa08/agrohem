import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthService } from "../services/authService";
import { s } from "../styles";
import { T } from "../tokens";
import { Field, BtnPrimary, Spinner, ErrorBanner, Divider, SocialBtns, Leaf } from "../ui/SharedUI";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const LoginScreen = ({ goTo, onLogin }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLang, setShowLang] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const session = await AuthService.login(email, password);
      onLogin(session); goTo("home");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleDemo = async () => {
    setLoading(true); setError("");
    try {
      await AuthService.ensureDemoAccount();
      const session = await AuthService.login("demo@plantai.app", "demo123");
      onLogin(session); goTo("home");
    } catch (e) { setError("Demo login failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen-enter" style={{ ...s.screen, paddingBottom: 40, overflowY: "auto" }}>
      {showLang && <LanguageSwitcher onClose={() => setShowLang(false)} />}
      <div style={{ padding: "68px 24px 32px", textAlign: "center", position: "relative" }}>
        <button onClick={() => setShowLang(true)} style={{ position: "absolute", top: 54, right: 24, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 12px", color: T.textMuted, fontSize: 12, cursor: "pointer" }}>🌍 {t("language")}</button>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 320, height: 220, background: "radial-gradient(ellipse, rgba(62,207,106,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ width: 68, height: 68, background: "linear-gradient(135deg, #16a34a, #3ecf6a)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 36px rgba(62,207,106,0.35)", animation: "breathe 3s ease-in-out infinite", color: "white" }}>
          <Leaf size={34} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 500, marginBottom: 8, color: T.text }}>{t("welcome")}</h2>
        <p style={{ color: T.textMuted, fontSize: 15 }}>Log in to monitor your plant health.</p>
      </div>
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <ErrorBanner msg={error} />
        <Field label={t("email")} type="email" placeholder="Enter your email" value={email} onChange={setEmail}
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
        />
        <Field label={t("password")} type="password" placeholder="••••••••" value={password} onChange={setPassword}
          icon={<svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
        />
        <button onClick={() => goTo("forgot")} style={{ background: "none", border: "none", color: T.green, fontSize: 13, cursor: "pointer", textAlign: "right" }}>{t("forgotPassword")}</button>
        <BtnPrimary onClick={handleLogin} disabled={loading}>
          {loading ? <Spinner size={18} /> : t("login")}
        </BtnPrimary>
        <button onClick={handleDemo} disabled={loading} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px", color: T.textMuted, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}>
          🌿 {t("demoAccount")}
        </button>
        <Divider label="OR CONTINUE WITH" />
        <SocialBtns />
        <p style={{ textAlign: "center", fontSize: 13, color: T.textMuted }}>
          {t("noAccount")}{" "}
          <button onClick={() => goTo("signup")} style={{ background: "none", border: "none", color: T.green, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>{t("createAccount")}</button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
