import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import sw from "./locales/sw.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";

const savedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sw: { translation: sw },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
