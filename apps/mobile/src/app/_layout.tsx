import "react-native-gesture-handler";
import "../i18n";
import "../global.css";
import "react-native-reanimated";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack, useRouter, type Href } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View } from "react-native";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RecordingAppStateBridge } from "../components/recording/RecordingAppStateBridge";
import { OfflineBanner } from "../components/ui/OfflineBanner";
import { useOffline } from "../hooks/useOffline";
import { useTheme } from "../hooks/useTheme";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";
import { addRecordingNotificationListener } from "../services/recordingNotifications";
import { ensureDemoContent } from "../services/demoBootstrap";
import { initRecordingSessionLifecycle } from "../services/recordingSession";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const theme = useTheme();
  const { isOffline } = useOffline();
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const settingsHydrated = useSettingsStore((s) => s.isHydrated);
  const authHydrated = useAuthStore((s) => s.isHydrated);

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const userId = useAuthStore((s) => s.user?.id);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    void hydrateAuth();
    void hydrateSettings();
    initRecordingSessionLifecycle({
      title: "Record a lecture",
      recordingNow: "Recording",
      stop: "Stop",
    });
    const sub = addRecordingNotificationListener((screen) => {
      if (screen.startsWith("/note/")) {
        router.push(screen as Href);
      }
    });
    return () => sub.remove();
  }, [hydrateAuth, hydrateSettings, router]);

  useEffect(() => {
    if (authHydrated && isLoggedIn && userId) {
      ensureDemoContent(userId);
    }
  }, [authHydrated, isLoggedIn, userId]);

  useEffect(() => {
    if (fontsLoaded && settingsHydrated && authHydrated) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, settingsHydrated, authHydrated]);

  const ready = fontsLoaded && settingsHydrated && authHydrated;

  return (
    <GestureHandlerRootView style={styles.flex}>
      <ErrorBoundary>
        <View style={[styles.flex, { backgroundColor: theme.background }]}>
          <StatusBar style={theme.isDark ? "light" : "dark"} />
          {isOffline ? <OfflineBanner /> : null}
          {ready ? <RecordingAppStateBridge /> : null}
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="language" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="recording"
              options={{ presentation: "modal", animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="profile"
              options={{ animation: "slide_from_right", headerShown: false }}
            />
            <Stack.Screen
              name="note/[id]"
              options={{ animation: "slide_from_right", headerShown: false }}
            />
          </Stack>
          {!ready ? <View style={[styles.bootOverlay, styles.boot]} pointerEvents="none" /> : null}
        </View>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  boot: { backgroundColor: "#F5F5FF" },
  bootOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
});
