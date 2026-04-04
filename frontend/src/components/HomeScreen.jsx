import { useState, useEffect } from "react";
import { AuthService } from "../services/authService";
import { HistoryService } from "../services/historyService";
import { s } from "../styles";
import { T } from "../tokens";
import { BottomNav, BtnPrimary, Spinner } from "../ui/SharedUI";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) { setError("Location not supported"); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
          );
          const data = await res.json();
          const c = data.current;

          // Reverse geocode to get city name
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
          );
          const geoData = await geoRes.json();
          const city = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || "Your Location";

          const code = c.weather_code;
          const getCondition = (code) => {
            if (code === 0) return { label: "Clear Sky", icon: "☀️" };
            if (code <= 2) return { label: "Partly Cloudy", icon: "⛅" };
            if (code === 3) return { label: "Overcast", icon: "☁️" };
            if (code <= 49) return { label: "Foggy", icon: "🌫️" };
            if (code <= 59) return { label: "Drizzle", icon: "🌦️" };
            if (code <= 69) return { label: "Rainy", icon: "🌧️" };
            if (code <= 79) return { label: "Snowy", icon: "❄️" };
            if (code <= 84) return { label: "Rain Showers", icon: "🌨️" };
            if (code <= 99) return { label: "Thunderstorm", icon: "⛈️" };
            return { label: "Unknown", icon: "🌡️" };
          };

          const condition = getCondition(code);
          const plantTip = () => {
            if (code === 0 || code <= 2) return "Great day to check your plants for sun stress.";
            if (code <= 49) return "Low light today — indoor plants may need a grow light.";
            if (code <= 69) return "Rain today — skip watering, check for overwatering signs.";
            if (code <= 79) return "Cold weather — protect sensitive plants from frost.";
            if (code <= 99) return "Storm incoming — move potted plants indoors.";
            return "Check your plants today.";
          };

          setWeather({
            temp: Math.round(c.temperature_2m),
            humidity: c.relative_humidity_2m,
            wind: Math.round(c.wind_speed_10m),
            condition,
            city,
            tip: plantTip(),
          });
        } catch (e) { setError("Could not load weather"); }
        finally { setLoading(false); }
      },
      () => { setError("Location access denied"); setLoading(false); }
    );
  }, []);

  if (loading) return (
    <div style={{ margin: "0 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
      <Spinner size={16} />
      <span style={{ fontSize: 13, color: T.textMuted }}>Detecting your location...</span>
    </div>
  );

  if (error) return (
    <div style={{ margin: "0 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 18 }}>📍</span>
      <span style={{ fontSize: 12, color: T.textMuted }}>{error} — enable location for weather</span>
    </div>
  );

  return (
    <div style={{ margin: "0 20px", background: `linear-gradient(135deg, ${T.surface}, ${T.surface2})`, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "14px 16px", overflow: "hidden", position: "relative" }}>
      {/* Background glow */}
      <div style={{ position: "absolute", right: -10, top: -10, width: 80, height: 80, background: "radial-gradient(circle, rgba(62,207,106,0.08), transparent 70%)", pointerEvents: "none" }} />

      {/* Top row — city + condition */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: T.green, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>📍 {weather.city}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>{weather.condition.icon}</span>
          <span style={{ fontSize: 12, color: T.textMuted }}>{weather.condition.label}</span>
        </div>
      </div>

      {/* Middle row — temp + stats */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
          <span style={{ fontSize: 38, fontWeight: 700, color: T.text, lineHeight: 1 }}>{weather.temp}°</span>
          <span style={{ fontSize: 14, color: T.textMuted, marginBottom: 4 }}>C</span>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>💧</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{weather.humidity}%</div>
            <div style={{ fontSize: 10, color: T.textDim }}>Humidity</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>💨</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{weather.wind}</div>
            <div style={{ fontSize: 10, color: T.textDim }}>km/h</div>
          </div>
        </div>
      </div>

      {/* Plant tip */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>🌱</span>
        <span style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{weather.tip}</span>
      </div>
    </div>
  );
};

const HomeScreen = ({ goTo, session, onLogout }) => {
  const [stats, setStats] = useState({ total: 0, healthy: 0, diseased: 0 });
  const [recents, setRecents] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    Promise.all([HistoryService.getStats(), HistoryService.getAll()]).then(([st, all]) => {
      setStats(st);
      setRecents(all.slice(0, 3));
      setLoadingStats(false);
    });
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="screen-enter" style={s.screen}>
      {/* Header */}
      <div style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, color: T.textMuted }}>{greeting} 👋</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, color: T.text }}>{session?.name?.split(" ")[0] || "Gardener"}</h1>
        </div>
        <button onClick={async () => { await AuthService.logout(); onLogout(); goTo("login"); }} style={s.iconBtn} title="Logout">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2} strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Stats */}
      <div style={{ margin: "14px 20px 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {[
          { label: "Total Scans", value: stats.total, color: T.blue },
          { label: "Healthy", value: stats.healthy, color: T.green },
          { label: "Diseased", value: stats.diseased, color: T.red },
        ].map(stat => (
          <div key={stat.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px 12px", textAlign: "center" }}>
            {loadingStats ? <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}><Spinner size={18} /></div>
              : <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>}
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scan CTA */}
      <div style={{ margin: "14px 20px 0", background: "linear-gradient(135deg, #0e2e1a, #152b1c)", border: `1px solid ${T.greenDim}`, borderRadius: T.radius, padding: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 120, height: 120, background: "radial-gradient(circle, rgba(62,207,106,0.15), transparent 70%)" }} />
        <div style={{ fontSize: 32, marginBottom: 10 }}>🔬</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: T.text }}>Scan a Plant</h3>
        <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 16, lineHeight: 1.55 }}>Upload a photo for instant AI-powered disease diagnosis.</p>
        <BtnPrimary onClick={() => goTo("scan")} style={{ width: "auto", padding: "11px 22px", fontSize: 14 }}>📸 Start Scan</BtnPrimary>
      </div>

      {/* Tips */}
      <div style={{ margin: "14px 20px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[{ icon: "☀️", title: "Best light", tip: "Photograph in natural daylight" }, { icon: "🎯", title: "Get close", tip: "Focus on affected leaves" }].map(c => (
          <div key={c.title} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "14px 12px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: T.text }}>{c.title}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{c.tip}</div>
          </div>
        ))}
      </div>

      {/* Recent Scans */}
      <div style={{ margin: "16px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Recent Scans</h3>
          <button onClick={() => goTo("history")} style={{ background: "none", border: "none", color: T.green, fontSize: 13, cursor: "pointer" }}>See all →</button>
        </div>
        {recents.length === 0 ? (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "28px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🌱</div>
            <p style={{ color: T.textMuted, fontSize: 13 }}>No scans yet. Scan your first plant!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recents.map(scan => (
              <div key={scan.id} className="plant-card-hover" onClick={() => goTo("history")} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}>
                {scan.imageData
                  ? <img src={scan.imageData} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} alt="" />
                  : <div style={{ width: 44, height: 44, borderRadius: 10, background: T.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🌿</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.result?.plantName || "Unknown Plant"}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{scan.result?.disease || "No disease detected"}</div>
                </div>
                <span style={s.badge(scan.result?.isHealthy ? T.green : T.yellow, scan.result?.isHealthy ? "rgba(62,207,106,0.15)" : "rgba(212,167,74,0.15)")}>
                  {scan.result?.isHealthy ? "✓ Healthy" : "⚠️ Issue"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav screen="home" goTo={goTo} />
    </div>
  );
};

export default HomeScreen;
