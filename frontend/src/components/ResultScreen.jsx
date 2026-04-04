import { s } from "../styles";
import { T } from "../tokens";
import { BottomNav, BtnPrimary } from "../ui/SharedUI";

const ResultScreen = ({ goTo, currentScan }) => {
  if (!currentScan?.result) {
    return (
      <div className="screen-enter" style={s.screen}>
        <div style={s.pageHeader}>
          <button onClick={() => goTo("scan")} style={s.iconBtn}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg></button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: T.text }}>Analysis Result</h1>
          <div style={{ width: 38 }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 20 }}>
          <div style={{ fontSize: 52 }}>🌿</div>
          <p style={{ color: T.textMuted, textAlign: "center", fontSize: 14 }}>No scan result yet. Please scan a plant first.</p>
          <BtnPrimary onClick={() => goTo("scan")} style={{ width: "auto", padding: "12px 28px", fontSize: 14 }}>📸 Start Scanning</BtnPrimary>
        </div>
        <BottomNav screen="result" goTo={goTo} />
      </div>
    );
  }

  const { result, imageData } = currentScan;
  const healthy = result.isHealthy;
  const sevColor = { none: T.green, mild: T.yellow, moderate: T.yellow, severe: T.red }[result.severity] || T.yellow;
  const urgencyColor = { low: T.green, medium: T.yellow, high: T.red }[result.urgency] || T.yellow;

  const Section = ({ title, items, dot }) => items?.length > 0 && (
    <div style={{ margin: "12px 20px 0", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: T.text }}>{title}</h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0", borderBottom: i < items.length - 1 ? `1px solid ${T.border}` : "none", fontSize: 14, color: T.textMuted, lineHeight: 1.5 }}>
          {dot === "number"
            ? <div style={{ width: 20, height: 20, background: "rgba(62,207,106,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.green, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
            : <div style={{ width: 8, height: 8, background: dot || T.yellow, borderRadius: "50%", flexShrink: 0, marginTop: 6 }} />}
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <div className="screen-enter" style={s.screen}>
      <div style={s.pageHeader}>
        <button onClick={() => goTo("scan")} style={s.iconBtn}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg></button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 500, color: T.text }}>Analysis Result</h1>
        <button onClick={() => goTo("history")} style={s.iconBtn}><svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg></button>
      </div>

      <div style={{ margin: "0 20px", height: 200, borderRadius: 18, position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 40% 50%, #1a3320 0%, #0a1a0d 50%, #050d06 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {imageData
          ? <img src={imageData} alt="Scanned plant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 86, filter: "drop-shadow(0 0 24px rgba(62,207,106,0.45))" }}>🍃</span>}
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid rgba(62,207,106,0.4)`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: 600, color: T.green, display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, background: T.green, borderRadius: "50%", animation: "pulse 1.5s ease-in-out infinite" }} />
          {result.confidence}% Match
        </div>
        {result.urgency && result.urgency !== "low" && (
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", border: `1px solid ${urgencyColor}40`, borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: urgencyColor }}>
            {result.urgency === "high" ? "🚨 Urgent" : "⚡ Act Soon"}
          </div>
        )}
      </div>

      <div style={{ margin: "14px 20px 0", background: healthy ? "rgba(62,207,106,0.06)" : "rgba(212,167,74,0.06)", border: `1px solid ${healthy ? "rgba(62,207,106,0.25)" : "rgba(212,167,74,0.25)"}`, borderRadius: T.radius, padding: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: healthy ? "rgba(62,207,106,0.15)" : "rgba(212,167,74,0.15)", color: healthy ? T.green : T.yellow, borderRadius: T.radiusXs, padding: "4px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 12 }}>
          {healthy ? "✓ Healthy Plant" : "⚠️ Detected Disease"}
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, marginBottom: 4, color: T.text }}>{result.plantName}</h2>
        {result.scientificName && <p style={{ fontSize: 12, color: T.textMuted, fontStyle: "italic", marginBottom: 10 }}>{result.scientificName}</p>}
        {result.disease && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={s.badge(sevColor, `${sevColor}22`)}>{result.disease}</span>
            <span style={s.badge(T.textMuted, T.surface3)}>{result.severity} severity</span>
          </div>
        )}
        <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.65 }}>{result.description}</p>
      </div>

      <Section title="🔍 Key Symptoms" items={result.symptoms} dot={T.yellow} />
      <Section title="💊 Recommended Treatments" items={result.treatments} dot="number" />
      <Section title="🌿 Care Advice" items={result.careAdvice} dot={T.blue} />

      <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
        <BtnPrimary onClick={() => goTo("history")} style={{ flex: 1 }}>💾 View History</BtnPrimary>
        <button onClick={() => goTo("scan")} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px", color: T.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          📸 New Scan
        </button>
      </div>
      <BottomNav screen="result" goTo={goTo} />
    </div>
  );
};

export default ResultScreen;
