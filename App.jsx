import { useState, useEffect } from "react";
import { AuthService } from "./services/authService";
import { s } from "./styles";
import { T } from "./tokens";
import { Spinner, Leaf } from "./ui/SharedUI";

import LoginScreen   from "./components/LoginScreen";
import SignupScreen  from "./components/SignupScreen";
import HomeScreen    from "./components/HomeScreen";
import ScanScreen    from "./components/ScanScreen";
import ResultScreen  from "./components/ResultScreen";
import HistoryScreen from "./components/HistoryScreen";

export default function App() {
  const [screen, setScreen]           = useState(null);
  const [session, setSession]         = useState(null);
  const [currentScan, setCurrentScan] = useState(null);
  const [booting, setBooting]         = useState(true);

  useEffect(() => {
    AuthService.getSession().then(s => {
      setSession(s);
      setScreen(s ? "home" : "login");
      setBooting(false);
    });
  }, []);

  const goTo = (next) => {
    setScreen(null);
    setTimeout(() => setScreen(next), 12);
  };

  if (booting) {
    return (
      <div style={{ minHeight: "100vh", background: "#070a09", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #16a34a, #3ecf6a)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "white", animation: "breathe 2s ease-in-out infinite" }}>
          <Leaf size={30} />
        </div>
        <Spinner size={26} />
        <p style={{ color: T.textMuted, fontSize: 14 }}>Loading PlantAI…</p>
      </div>
    );
  }

  const screens = {
    login:   <LoginScreen   goTo={goTo} onLogin={setSession} />,
    signup:  <SignupScreen  goTo={goTo} onLogin={setSession} />,
    home:    <HomeScreen    goTo={goTo} session={session} onLogout={() => setSession(null)} />,
    scan:    <ScanScreen    goTo={goTo} onScanComplete={setCurrentScan} />,
    result:  <ResultScreen  goTo={goTo} currentScan={currentScan} />,
    history: <HistoryScreen goTo={goTo} onSelectScan={setCurrentScan} />,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#070a09", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div style={s.app}>
        {screen && screens[screen]}
      </div>
    </div>
  );
}
