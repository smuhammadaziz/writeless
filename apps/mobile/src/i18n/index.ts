import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import uz from "../locales/uz.json";
import ru from "../locales/ru.json";
import type { AppLanguage } from "../types";

const resources = {
  en: { translation: en },
  uz: { translation: uz },
  ru: { translation: ru },
};

const initPromise = i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnNull: false,
});

/** Wait for i18n, then set the active app language. Call before rendering UI that uses `t()`. */
export async function initI18n(language: AppLanguage = "en"): Promise<void> {
  await initPromise;
  await i18n.changeLanguage(language);
}

export default i18n;
