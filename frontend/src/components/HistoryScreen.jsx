import { useState, useEffect } from "react";
import { HistoryService } from "../services/historyService";
import { s } from "../styles";
import { T } from "../tokens";
import { BottomNav, Spinner } from "../ui/SharedUI";

const HistoryScreen = ({ goTo, onSelectScan }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Scans");
  const [search, setSearch] = useState("");
  const tabs = ["All Scans", "Healthy", "Diseased"];

  useEffect(() => {
    HistoryService.getAll().then(data => { setScans(data); setLoading(false); });
  }, []);

  const filtered = scans.filter(sc => {
    const matchTab = activeTab === "All Scans" || (activeTab === "Healthy" && sc.result?.isHealthy) || (activeTab === "Diseased" && !sc.result?.isHealthy);
    const q = search.toLowerCase();
    const matchSearch = !q || sc.result?.plantName?.toLowerCase().includes(q) || sc.result?.disease?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await HistoryService.delete(id);
    setScans(prev => prev.filter(s => s.id !== id));
  };

  const fmt = ts => {
    const d = new Date(ts);
    return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) };
  };

  return (
    <div className="screen-enter" style={s.screen}>
      <div style={{ ...s.pageHeader, paddingBottom: 8 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: T.text }}>Scan History</h1>
        <span style={{ fontSize: 12, color: T.textMuted, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 10px" }}>{scans.length} scans</span>
      </div>

      <div style={{ margin: "0 20px", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={T.textDim} strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plant or disease..." style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 14, flex: 1 }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16 }}>x</button>}
      </div>

      <div style={{ margin: "12px 20px 0", display: "flex", gap: 8 }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? "tab-active" : ""} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 20, padding: "7px 14px", color: T.textMuted, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s" }}>{tab}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60 }}><Spinner size={32} /></div>
      ) : filtered.length === 0 ? (
        <div style={{ margin: "20px", padding: "30px 20px", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{scans.length === 0 ? "🌱" : "🔎"}</div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>{scans.length === 0 ? "No scans yet. Start by scanning your first plant!" : "No results match your search or filter."}</p>
          {scans.length === 0 && (
            <button onClick={() => goTo("scan")} style={{ marginTop: 16, background: T.greenDim, border: "none", borderRadius: T.radiusSm, padding: "10px 20px", color: T.green, fontSize: 14, cursor: "pointer", fontWeight: 500 }}>📸 Start Scanning</button>
          )}
        </div>
      ) : (
        <div style={{ margin: "16px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(scan => {
            const { date, time } = fmt(scan.timestamp);
            return (
              <div key={scan.id} className="plant-card-hover" onClick={() => { onSelectScan(scan); goTo("result"); }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", transition: "all 0.2s" }}>
                {scan.imageData
                  ? <img src={scan.imageData} style={{ width: 54, height: 54, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} alt="" />
                  : <div style={{ width: 54, height: 54, borderRadius: 14, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🌿</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.result?.plantName || "Unknown Plant"}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 7, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.result?.disease || "No disease detected"}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={s.badge(scan.result?.isHealthy ? T.green : T.yellow, scan.result?.isHealthy ? "rgba(62,207,106,0.15)" : "rgba(212,167,74,0.15)")}>{scan.result?.isHealthy ? "✓ Healthy" : "⚠️ Diseased"}</span>
                    {scan.result?.confidence && <span style={s.badge(T.blue, "rgba(86,180,211,0.12)")}>{scan.result.confidence}%</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: T.textDim, lineHeight: 1.6, marginBottom: 6 }}>{date}<br />{time}</div>
                  <button onClick={e => handleDelete(scan.id, e)} style={{ background: "rgba(245,101,101,0.1)", border: "1px solid rgba(245,101,101,0.2)", borderRadius: 6, padding: "4px 8px", color: T.red, fontSize: 11, cursor: "pointer" }}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BottomNav screen="history" goTo={goTo} />
    </div>
  );
};

export default HistoryScreen;
