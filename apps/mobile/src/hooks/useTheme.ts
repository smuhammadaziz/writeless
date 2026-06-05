import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { getThemeColors, type ThemeColors } from "../constants/colors";
import { useSettingsStore } from "../store/settingsStore";

export function useTheme(): ThemeColors & { isDark: boolean } {
  const themePref = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  const isDark = useMemo(() => {
    if (themePref === "system") return system === "dark";
    return themePref === "dark";
  }, [themePref, system]);

  const colors = useMemo(() => getThemeColors(isDark ? "dark" : "light"), [isDark]);
  return { ...colors, isDark };
}
