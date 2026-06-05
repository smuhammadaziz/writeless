import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Alert } from "react-native";
import { STORAGE_KEYS } from "../constants/config";
import { config } from "../constants/config";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";
import { useRecordingStore } from "../store/recordingStore";
import { useSettingsStore } from "../store/settingsStore";
import type { User } from "../types";
import { removeItem } from "../utils/storage";

const DEMO_USER: User = {
  id: "demo-user-1",
  googleId: "demo-google-id",
  name: "Alex Student",
  email: "alex@writeless.app",
  avatar: "https://api.dicebear.com/7.x/avataaars/png?seed=Writeless",
  createdAt: new Date().toISOString(),
};

export function useAuth() {
  const { setAuth, clearAuth, isLoggedIn, user } = useAuthStore();
  const seedNotes = useNotesStore((s) => s.seedDemo);
  const seedRecordings = useRecordingStore((s) => s.seedDemo);

  const completeDemoSignIn = useCallback(async () => {
    const token = `demo-jwt-${Date.now()}`;
    await setAuth(DEMO_USER, token);
    seedNotes(DEMO_USER.id);
    seedRecordings(DEMO_USER.id);
  }, [setAuth, seedNotes, seedRecordings]);

  const signInWithGoogle = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const configured =
      config.googleWebClientId !== "your_google_web_client_id_here";
    if (!configured) {
      await completeDemoSignIn();
      return;
    }
    Alert.alert(
      "Google Sign-In",
      "Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env and use a development build. Using demo mode for UI preview."
    );
    await completeDemoSignIn();
  }, [completeDemoSignIn]);

  const signOut = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await clearAuth();
  }, [clearAuth]);

  const deleteAccount = useCallback(async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await clearAuth();
    await Promise.all(
      Object.values(STORAGE_KEYS).map((key) => removeItem(key))
    );
    useRecordingStore.setState({ recordings: [], flowStatus: "idle", lastNoteId: null });
    useNotesStore.setState({ notes: [], folders: [] });
    useSettingsStore.setState({
      languageChosen: false,
      onboardingDone: false,
      language: "en",
      theme: "light",
    });
  }, [clearAuth]);

  return {
    user,
    isLoggedIn,
    signInWithGoogle,
    signOut,
    deleteAccount,
  };
}
