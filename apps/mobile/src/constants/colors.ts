export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  accent: string;
}

export const lightColors: ThemeColors = {
  primary: "#6C63FF",
  background: "#F5F5FF",
  surface: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  accent: "#A78BFA",
};

export const darkColors: ThemeColors = {
  primary: "#6C63FF",
  background: "#0F0F1A",
  surface: "#1A1A2E",
  textPrimary: "#F5F5FF",
  textSecondary: "#9CA3AF",
  border: "#2D2D44",
  accent: "#A78BFA",
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === "dark" ? darkColors : lightColors;
}
