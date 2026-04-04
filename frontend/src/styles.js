import { T } from "./tokens";
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,500;1,400&display=swap";
document.head.appendChild(fontLink);
export const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #070a09; font-family: 'DM Sans', sans-serif; }
  input, button { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 0; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scanLine { 0%{top:8px;} 50%{top:calc(100% - 8px);} 100%{top:8px;} }
  @keyframes ripple { 0%{transform:scale(0.4);opacity:0.7;} 100%{transform:scale(2.2);opacity:0;} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.65);} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes breathe { 0%,100%{box-shadow:0 0 20px rgba(62,207,106,0.25);} 50%{box-shadow:0 0 40px rgba(62,207,106,0.5);} }
  @keyframes analyzing { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
  .screen-enter { animation: fadeUp 0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .plant-card-hover:hover { background:#1f2826!important; border-color:#3d5248!important; transform:translateY(-1px); }
  .nav-btn:hover { color:#3ecf6a!important; }
  .btn-primary:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); }
  .btn-primary:active:not(:disabled) { transform:scale(0.98); }
  .btn-social:hover { background:#1f2826!important; border-color:#3d5248!important; }
  .tab-active { background:#3ecf6a!important; border-color:#3ecf6a!important; color:white!important; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = globalCSS;
document.head.appendChild(styleEl);
export const s = {
  app: { width: "100%", maxWidth: 430, minHeight: "100vh", background: T.bg, margin: "0 auto", position: "relative", overflow: "hidden" },
  screen: { display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 84, overflowY: "auto" },
  pageHeader: { padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  iconBtn: { width: 38, height: 38, borderRadius: "50%", background: T.surface2, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text, flexShrink: 0, transition: "all 0.2s" },
  label: { fontSize: 12, fontWeight: 500, color: T.textMuted, marginBottom: 6, display: "block" },
  input: { width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px 42px 12px 14px", color: T.text, fontSize: 14, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s" },
  badge: (color, bg) => ({ display: "inline-flex", alignItems: "center", borderRadius: 5, padding: "3px 9px", fontSize: 11, fontWeight: 600, color, background: bg }),
};
