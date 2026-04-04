import { useState } from "react";
import { T } from "../tokens";
import { s } from "../styles";

export const Leaf = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const HomeIcon = ({ active }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill={active ? T.green : "none"} stroke={active ? T.green : T.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

export const ScanIcon = ({ active }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? T.green : T.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M3 9a2 2 0 0 1 2-2h1l2-2h4l2 2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
  </svg>
);

export const ResultIcon = ({ active }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? T.green : T.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

export const HistoryIcon = ({ active }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? T.green : T.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
  </svg>
);

export const RemindersIcon = ({ active }) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? T.green : T.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export const BottomNav = ({ screen, goTo }) => (
  <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.surface, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0 18px", zIndex: 200 }}>
    {[
      { id: "home",      label: "Home",      Icon: HomeIcon },
      { id: "scan",      label: "Scan",      Icon: ScanIcon },
      { id: "result",    label: "Results",   Icon: ResultIcon },
      { id: "history",   label: "History",   Icon: HistoryIcon },
      { id: "reminders", label: "Reminders", Icon: RemindersIcon },
    ].map(({ id, label, Icon: I }) => (
      <button key={id} className="nav-btn" onClick={() => goTo(id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 10px", color: screen === id ? T.green : T.textMuted, fontSize: 10, fontWeight: 500, background: "none", border: "none", transition: "color 0.2s" }}>
        <I active={screen === id} />{label}
      </button>
    ))}
  </nav>
);

export const Field = ({ label, type = "text", placeholder, value, onChange, icon }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {label && <label style={s.label}>{label}</label>}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input type={type} placeholder={placeholder} value={value || ""} onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...s.input, borderColor: focused ? T.green : T.border, boxShadow: focused ? `0 0 0 3px ${T.greenGlow}` : "none" }} />
        {icon && <span style={{ position: "absolute", right: 12, color: T.textMuted, pointerEvents: "none" }}>{icon}</span>}
      </div>
    </div>
  );
};

export const BtnPrimary = ({ children, onClick, style = {}, disabled }) => (
  <button className="btn-primary" onClick={onClick} disabled={disabled} style={{ background: disabled ? T.surface3 : `linear-gradient(135deg, #16a34a, ${T.green})`, color: disabled ? T.textMuted : "white", border: "none", borderRadius: T.radiusSm, padding: "14px 20px", fontSize: 15, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", boxShadow: disabled ? "none" : "0 4px 20px rgba(62,207,106,0.28)", ...style }}>{children}</button>
);

export const Spinner = ({ size = 20 }) => (
  <div style={{ width: size, height: size, border: `2px solid rgba(62,207,106,0.2)`, borderTop: `2px solid ${T.green}`, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
);

export const ErrorBanner = ({ msg }) => msg ? (
  <div style={{ background: "rgba(245,101,101,0.1)", border: "1px solid rgba(245,101,101,0.3)", borderRadius: T.radiusSm, padding: "10px 14px", fontSize: 13, color: T.red }}>{msg}</div>
) : null;

export const SocialBtns = () => (
  <div style={{ display: "flex", gap: 10 }}>
    {["G Google", " Apple", "f Facebook"].map(label => (
      <button key={label} className="btn-social" style={{ flex: 1, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "11px", color: T.text, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
    ))}
  </div>
);

export const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{ flex: 1, height: 1, background: T.border }} />
    <span style={{ fontSize: 11, color: T.textDim, fontWeight: 500, letterSpacing: "0.5px" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);
