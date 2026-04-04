import { useState, useEffect } from "react";
import { RemindersService } from "../services/remindersService";
import { s } from "../styles";
import { T } from "../tokens";
import { BottomNav, BtnPrimary, Spinner, ErrorBanner } from "../ui/SharedUI";

const RemindersScreen = ({ goTo }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [plantName, setPlantName] = useState("");
  const [note, setNote] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    RemindersService.getAll().then(data => { setReminders(data); setLoading(false); });
  }, []);

  const handleAdd = async () => {
    if (!plantName || !remindAt) { setError("Plant name and date are required"); return; }
    setSaving(true); setError("");
    try {
      await RemindersService.add(plantName, note, new Date(remindAt).getTime());
      const updated = await RemindersService.getAll();
      setReminders(updated);
      setShowForm(false);
      setPlantName(""); setNote(""); setRemindAt("");
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await RemindersService.delete(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const fmt = ts => new Date(ts).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  const isOverdue = ts => Date.now() > ts;
  const isDueSoon = ts => !isOverdue(ts) && ts - Date.now() < 24 * 3600 * 1000;

  return (
    <div className="screen-enter" style={s.screen}>
      {/* Header */}
      <div style={{ ...s.pageHeader, paddingBottom: 8 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 500, color: T.text }}>Reminders</h1>
        <button onClick={() => { setShowForm(true); setError(""); }} style={{ background: T.green, border: "none", borderRadius: T.radiusSm, padding: "8px 16px", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          + Add
        </button>
      </div>

      {/* Add Reminder Form */}
      {showForm && (
        <div style={{ margin: "0 20px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: T.text }}>New Reminder</h3>
          <ErrorBanner msg={error} />

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={s.label}>Plant Name *</label>
            <input value={plantName} onChange={e => setPlantName(e.target.value)} placeholder="e.g. Rose, Tomato, Basil"
              style={{ ...s.input, borderColor: T.border }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={s.label}>Reminder Date & Time *</label>
            <input type="datetime-local" value={remindAt} onChange={e => setRemindAt(e.target.value)}
              style={{ ...s.input, borderColor: T.border, colorScheme: "dark" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={s.label}>Note (optional)</label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Water every 3 days, check for pests"
              style={{ ...s.input, borderColor: T.border }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setShowForm(false); setError(""); }} style={{ flex: 1, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "12px", color: T.textMuted, fontSize: 14, cursor: "pointer" }}>
              Cancel
            </button>
            <BtnPrimary onClick={handleAdd} disabled={saving} style={{ flex: 2, padding: "12px" }}>
              {saving ? <Spinner size={16} /> : "💾 Save Reminder"}
            </BtnPrimary>
          </div>
        </div>
      )}

      {/* Reminders List */}
      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60 }}>
          <Spinner size={32} />
        </div>
      ) : reminders.length === 0 ? (
        <div style={{ margin: "20px", padding: "40px 20px", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🔔</div>
          <h3 style={{ color: T.text, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No reminders yet</h3>
          <p style={{ color: T.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Add reminders to track watering schedules, fertilizing, and plant care routines.</p>
          <BtnPrimary onClick={() => setShowForm(true)} style={{ width: "auto", padding: "11px 24px", fontSize: 14 }}>
            + Add First Reminder
          </BtnPrimary>
        </div>
      ) : (
        <div style={{ margin: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {reminders.map(r => {
            const overdue = isOverdue(r.remind_at);
            const soon = isDueSoon(r.remind_at);
            const statusColor = overdue ? T.red : soon ? T.yellow : T.green;
            const statusBg = overdue ? "rgba(245,101,101,0.1)" : soon ? "rgba(212,167,74,0.1)" : "rgba(62,207,106,0.1)";
            const statusLabel = overdue ? "Overdue" : soon ? "Due Soon" : "Upcoming";
            const statusIcon = overdue ? "🔴" : soon ? "🟡" : "🟢";
            return (
              <div key={r.id} style={{ background: T.surface, border: `1px solid ${overdue ? "rgba(245,101,101,0.3)" : soon ? "rgba(212,167,74,0.3)" : T.border}`, borderRadius: T.radius, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>🌿</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: T.text }}>{r.plant_name}</span>
                    </div>
                    {r.note && <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5, marginBottom: 8 }}>{r.note}</p>}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, background: statusBg, color: statusColor, padding: "3px 10px", borderRadius: 20, fontWeight: 600 }}>
                        {statusIcon} {statusLabel}
                      </span>
                      <span style={{ fontSize: 12, color: T.textMuted }}>
                        🕐 {fmt(r.remind_at)}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(r.id)} style={{ background: "rgba(245,101,101,0.1)", border: "1px solid rgba(245,101,101,0.2)", borderRadius: 8, padding: "6px 10px", color: T.red, fontSize: 12, cursor: "pointer", flexShrink: 0 }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav screen="reminders" goTo={goTo} />
    </div>
  );
};

export default RemindersScreen;
