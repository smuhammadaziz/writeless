import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { AppLogo } from "../components/ui/AppLogo";
import { config } from "../constants/config";
import { fontFamily, fontSize } from "../constants/typography";
import { useTranslation } from "../hooks/useTranslation";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const scale = useSharedValue(0.3);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const languageChosen = useSettingsStore((s) => s.languageChosen);
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  const setTheme = useSettingsStore((s) => s.setTheme);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
  }, [scale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!languageChosen) {
        void setTheme("light");
        router.replace("/language");
        return;
      }
      if (!onboardingDone) {
        router.replace("/onboarding");
        return;
      }
      if (!isLoggedIn) {
        router.replace("/login");
        return;
      }
      router.replace("/(tabs)/home");
    }, config.splashDurationMs);
    return () => clearTimeout(timer);
  }, [isLoggedIn, languageChosen, onboardingDone, router, setTheme]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={logoStyle}>
        <AppLogo size={96} color="#FFFFFF" showName />
      </Animated.View>
      <Animated.View entering={FadeIn.delay(600).duration(800)}>
        <Text style={styles.tagline}>{t("splash.tagline")}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  tagline: {
    marginTop: 24,
    color: "#FFFFFF",
    fontSize: fontSize.subtitle,
    fontFamily: fontFamily.medium,
    textAlign: "center",
    opacity: 0.95,
  },
});
