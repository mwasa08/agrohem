import { useState } from "react";
import { AuthService } from "../services/authService";
import { s } from "../styles";
import { T } from "../tokens";
import { Field, BtnPrimary, Spinner, ErrorBanner, Divider, SocialBtns, Leaf } from "../ui/SharedUI";

const SignupScreen = ({ goTo, onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) { setError("Please fill all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!email.includes("@")) { setError("Please enter a valid email"); return; }
    setLoading(true); setError("");
    try {
      const session = await AuthService.signup(name, email, password);
      onLogin(session); goTo("home");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="screen-enter" style={{ ...s.screen, paddingBottom: 40, overflowY: "auto" }}>
      <div style={{ padding: "68px 24px 28px", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(62,207,106,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #16a34a, #3ecf6a)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: "0 0 30px rgba(62,207,106,0.3)", color: "white" }}>
          <Leaf size={32} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 500, marginBottom: 6, color: T.text }}>Create account</h2>
        <p style={{ color: T.textMuted, fontSize: 14 }}>Start monitoring your plants with AI.</p>
      </div>
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <ErrorBanner msg={error} />
        <Field label="Full Name" placeholder="Your name" value={name} onChange={setName} />
        <Field label="Email" type="email" placeholder="Enter your email" value={email} onChange={setEmail} />
        <Field label="Password" type="password" placeholder="Min. 6 characters" value={password} onChange={setPassword} />
        <BtnPrimary onClick={handleSignup} disabled={loading}>
          {loading ? <Spinner size={18} /> : "Create Account →"}
        </BtnPrimary>
        <Divider label="OR CONTINUE WITH" />
        <SocialBtns />
        <p style={{ textAlign: "center", fontSize: 13, color: T.textMuted }}>
          Already have an account?{" "}
          <button onClick={() => goTo("login")} style={{ background: "none", border: "none", color: T.green, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Log in</button>
        </p>
      </div>
    </div>
  );
};

export default SignupScreen;
