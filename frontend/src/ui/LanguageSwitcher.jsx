import { useTranslation } from "react-i18next";
import { T } from "../tokens";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "sw", label: "Swahili", flag: "🇹🇿" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

const LanguageSwitcher = ({ onClose }) => {
  const { i18n } = useTranslation();

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    document.dir = code === "ar" ? "rtl" : "ltr";
    onClose?.();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, background: T.surface, borderRadius: "20px 20px 0 0", padding: "24px 20px 40px", border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: T.text }}>🌍 Select Language</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {languages.map(lang => (
            <button key={lang.code} onClick={() => handleChange(lang.code)} style={{
              display: "flex", alignItems: "center", gap: 14,
              background: i18n.language === lang.code ? "rgba(62,207,106,0.1)" : T.surface2,
              border: `1px solid ${i18n.language === lang.code ? T.green : T.border}`,
              borderRadius: 12, padding: "14px 16px", cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 28 }}>{lang.flag}</span>
              <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{lang.label}</span>
              {i18n.language === lang.code && (
                <span style={{ marginLeft: "auto", color: T.green, fontSize: 18 }}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
