import { Appearance } from "react-native";
import { create } from "zustand";
import type { AppLanguage, ThemePreference } from "../types";
import { STORAGE_KEYS } from "../constants/config";
import { getItem, setItem } from "../utils/storage";
import { initI18n } from "../i18n";

interface SettingsState {
  language: AppLanguage;
  theme: ThemePreference;
  notificationsEnabled: boolean;
  languageChosen: boolean;
  onboardingDone: boolean;
  isHydrated: boolean;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setNotifications: (enabled: boolean) => void;
  setLanguageChosen: (value: boolean) => Promise<void>;
  setOnboardingDone: (value: boolean) => Promise<void>;
  hydrate: () => Promise<void>;
  resolvedTheme: () => "light" | "dark";
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  language: "en",
  theme: "light",
  notificationsEnabled: true,
  languageChosen: false,
  onboardingDone: false,
  isHydrated: false,
  setLanguage: async (language) => {
    await setItem(STORAGE_KEYS.language, language);
    await initI18n(language);
    set({ language });
  },
  setTheme: async (theme) => {
    await setItem(STORAGE_KEYS.theme, theme);
    set({ theme });
  },
  setNotifications: (notificationsEnabled) => set({ notificationsEnabled }),
  setLanguageChosen: async (languageChosen) => {
    await setItem(STORAGE_KEYS.languageChosen, languageChosen);
    set({ languageChosen });
  },
  setOnboardingDone: async (onboardingDone) => {
    await setItem(STORAGE_KEYS.onboardingDone, onboardingDone);
    set({ onboardingDone });
  },
  hydrate: async () => {
    const [language, theme, languageChosen, onboardingDone] =
      await Promise.all([
        getItem<AppLanguage>(STORAGE_KEYS.language),
        getItem<ThemePreference>(STORAGE_KEYS.theme),
        getItem<boolean>(STORAGE_KEYS.languageChosen),
        getItem<boolean>(STORAGE_KEYS.onboardingDone),
      ]);
    const lang = language ?? "en";
    await initI18n(lang);
    set({
      language: lang,
      theme: theme ?? "light",
      languageChosen: languageChosen ?? false,
      onboardingDone: onboardingDone ?? false,
      isHydrated: true,
    });
  },
  resolvedTheme: () => {
    const { theme } = get();
    if (theme === "system") {
      return Appearance.getColorScheme() === "dark" ? "dark" : "light";
    }
    return theme;
  },
}));
