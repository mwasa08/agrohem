import { useState, useRef, useEffect } from "react";
import { PlantService } from "../services/plantService";
import { HistoryService } from "../services/historyService";
import { s } from "../styles";
import { T } from "../tokens";
import { BottomNav, BtnPrimary, Spinner } from "../ui/SharedUI";

const ScanScreen = ({ goTo, onScanComplete }) => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("options");
  const [stream, setStream] = useState(null);
  const galleryRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();

  const steps = ["Loading image...", "Sending to AI...", "Identifying plant...", "Generating diagnosis..."];

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

  const startCamera = async () => {
    setError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      setStream(mediaStream);
      setMode("camera");
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = mediaStream; }, 100);
    } catch (e) {
      setError("Camera access denied. Please allow camera permission in your browser.");
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setMode("options");
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const base64 = dataUrl.split(",")[1];
    stopCamera();
    setImage({ dataUrl, base64, mime: "image/jpeg", name: "camera-capture.jpg", size: "live capture" });
    setMode("preview");
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file (JPG, PNG, WEBP)"); return; }
    if (file.size > 12 * 1024 * 1024) { setError("Image must be under 12 MB"); return; }
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(",")[1];
      setImage({ dataUrl, base64, mime: file.type, name: file.name, size: (file.size / 1048576).toFixed(1) + " MB" });
      setMode("preview");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true); setError(""); setAnalyzeStep(0);
    const stepInterval = setInterval(() => setAnalyzeStep(s => Math.min(s + 1, steps.length - 1)), 1800);
    try {
      const result = await PlantService.analyze(image.base64, image.mime);
      const scan = { timestamp: Date.now(), imageData: image.dataUrl, imageName: image.name, result };
      await HistoryService.save(scan);
      onScanComplete({ id: `scan_${scan.timestamp}`, ...scan });
      goTo("result");
    } catch (e) {
      setError("Analysis failed: " + (e.message || "Unknown error"));
    } finally {
      clearInterval(stepInterval);
      setAnalyzing(false);
      setAnalyzeStep(0);
    }
  };

  const reset = () => { setImage(null); setError(""); setMode("options"); };

  return (
    <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", background: T.bg, margin: "0 auto", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input ref={galleryRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => processFile(e.target.files[0])} />

      {/* ── OPTIONS SCREEN ── */}
      {mode === "options" && (
        <div className="screen-enter" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={() => goTo("home")} style={s.iconBtn}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Scan Plant</h1>
            <div style={{ width: 38 }} />
          </div>

          {/* Hero */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px 40px", gap: 12 }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle, rgba(62,207,106,0.2), rgba(62,207,106,0.05))", border: `2px solid rgba(62,207,106,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, marginBottom: 8, animation: "breathe 3s ease-in-out infinite" }}>🌿</div>
            <h2 style={{ color: T.text, fontSize: 22, fontWeight: 600, textAlign: "center" }}>Diagnose your plant</h2>
            <p style={{ color: T.textMuted, fontSize: 14, textAlign: "center", lineHeight: 1.6, marginBottom: 16 }}>Take a live photo or upload an image for an instant AI diagnosis.</p>

            {error && (
              <div style={{ background: "rgba(245,101,101,0.12)", border: "1px solid rgba(245,101,101,0.4)", borderRadius: T.radiusSm, padding: "10px 14px", fontSize: 13, color: T.red, textAlign: "center", width: "100%", marginBottom: 8 }}>{error}</div>
            )}

            <BtnPrimary onClick={startCamera} style={{ width: "100%", fontSize: 16, padding: "15px" }}>
              📷 Open Live Camera
            </BtnPrimary>

            <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", margin: "4px 0" }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 12, color: T.textDim }}>OR</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <button onClick={() => galleryRef.current?.click()} style={{ width: "100%", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "15px", color: T.text, fontSize: 16, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s" }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              Upload from Gallery
            </button>
          </div>
          <BottomNav screen="scan" goTo={goTo} />
        </div>
      )}

      {/* ── CAMERA SCREEN ── */}
      {mode === "camera" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", height: "100vh", background: "#000" }}>
          {/* Live video fills screen */}
          <video ref={videoRef} autoPlay playsInline muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

          {/* Top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}>
            <button onClick={stopCamera} style={{ ...s.iconBtn, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
            </button>
            <span style={{ color: "white", fontSize: 16, fontWeight: 600 }}>Live Camera</span>
            <div style={{ width: 38 }} />
          </div>

          {/* Corner scan frame */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -60%)", width: 220, height: 220, pointerEvents: "none", zIndex: 5 }}>
            {[
              { top: 0, left: 0, borderTop: `3px solid ${T.green}`, borderLeft: `3px solid ${T.green}` },
              { top: 0, right: 0, borderTop: `3px solid ${T.green}`, borderRight: `3px solid ${T.green}` },
              { bottom: 0, right: 0, borderBottom: `3px solid ${T.green}`, borderRight: `3px solid ${T.green}` },
              { bottom: 0, left: 0, borderBottom: `3px solid ${T.green}`, borderLeft: `3px solid ${T.green}` },
            ].map((st, i) => <div key={i} style={{ position: "absolute", width: 28, height: 28, ...st }} />)}
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${T.green}, transparent)`, animation: "scanLine 2s ease-in-out infinite" }} />
          </div>

          <p style={{ position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 13, zIndex: 5 }}>Point at a plant leaf</p>

          {/* Bottom controls — shutter area */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, paddingBottom: 48, paddingTop: 24, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            {/* Gallery shortcut */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingInline: 40 }}>
              <button onClick={() => galleryRef.current?.click()} style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
              </button>

              {/* SHUTTER BUTTON — big, centered, fully visible */}
              <button
                onClick={capturePhoto}
                style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "white",
                  border: `5px solid ${T.green}`,
                  boxShadow: `0 0 0 3px rgba(62,207,106,0.3), 0 0 24px rgba(62,207,106,0.4)`,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "transform 0.1s",
                }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "white", border: `2px solid rgba(0,0,0,0.08)` }} />
              </button>

              {/* Placeholder to keep shutter centered */}
              <div style={{ width: 48 }} />
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Tap the button to capture</p>
          </div>
        </div>
      )}

      {/* ── PREVIEW SCREEN ── */}
      {mode === "preview" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", height: "100vh", background: "#000" }}>
          {/* Captured image */}
          <img src={image?.dataUrl} alt="Captured plant" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: analyzing ? 0.35 : 1, transition: "opacity 0.3s" }} />

          {/* Top bar */}
          {!analyzing && (
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "54px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)" }}>
              <button onClick={reset} style={{ ...s.iconBtn, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>
              </button>
              <span style={{ color: "white", fontSize: 16, fontWeight: 600 }}>Preview</span>
              <div style={{ width: 38 }} />
            </div>
          )}

          {/* Analyzing overlay */}
          {analyzing && (
            <div style={{ position: "absolute", inset: 0, zIndex: 20, background: "rgba(11,15,14,0.88)", backdropFilter: "blur(6px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 90, height: 90 }}>
                <div style={{ position: "absolute", inset: 0, border: `3px solid rgba(62,207,106,0.15)`, borderTop: `3px solid ${T.green}`, borderRadius: "50%", animation: "spin 1.1s linear infinite" }} />
                <div style={{ position: "absolute", inset: 10, border: `2px solid rgba(62,207,106,0.1)`, borderTop: `2px solid ${T.greenBright}`, borderRadius: "50%", animation: "spin 0.65s linear infinite reverse" }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🔬</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 17, fontWeight: 600, color: T.text, marginBottom: 6 }}>Analyzing Plant</p>
                <p style={{ fontSize: 13, color: T.green, animation: "analyzing 1.5s ease-in-out infinite" }}>{steps[analyzeStep]}</p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {steps.map((_, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= analyzeStep ? T.green : T.border, transition: "background 0.3s" }} />)}
              </div>
            </div>
          )}

          {/* Error */}
          {error && !analyzing && (
            <div style={{ position: "absolute", top: 110, left: 20, right: 20, zIndex: 15, background: "rgba(245,101,101,0.15)", border: "1px solid rgba(245,101,101,0.4)", borderRadius: T.radiusSm, padding: "10px 14px", fontSize: 13, color: T.red, textAlign: "center" }}>{error}</div>
          )}

          {/* Bottom action buttons — fully visible above nav */}
          {!analyzing && (
            <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, zIndex: 10, padding: "0 20px", display: "flex", gap: 12 }}>
              <button onClick={reset} style={{ flex: 1, background: "rgba(19,25,24,0.92)", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, padding: "16px", color: T.text, fontSize: 15, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                🔄 Retake
              </button>
              <BtnPrimary onClick={handleAnalyze} style={{ flex: 2, padding: "16px", fontSize: 15 }}>
                🔬 Analyse Plant
              </BtnPrimary>
            </div>
          )}

          <BottomNav screen="scan" goTo={goTo} />
        </div>
      )}
    </div>
  );
};

export default ScanScreen;
