import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, InteractionManager, type AppStateStatus } from "react-native";
import {
  clearRecordingHomeNavigation,
  registerRecordingHomeNavigation,
} from "../../services/recordingNavigation";
import { useRecordingStore } from "../../store/recordingStore";

/**
 * When recording, leaving or re-entering the app must dismiss the recording modal.
 * replace() alone leaves a blank full-screen modal (white screen).
 */
export function RecordingAppStateBridge() {
  const router = useRouter();
  const flowStatus = useRecordingStore((s) => s.flowStatus);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const goHome = () => {
      InteractionManager.runAfterInteractions(() => {
        try {
          router.dismissTo("/(tabs)/home");
        } catch {
          router.replace("/(tabs)/home");
        }
      });
    };

    registerRecordingHomeNavigation(goHome);
    return () => clearRecordingHomeNavigation();
  }, [router]);

  useEffect(() => {
    if (flowStatus !== "recording") return;

    const onChange = (next: AppStateStatus) => {
      const prev = appStateRef.current;
      appStateRef.current = next;

      const wasBackground = prev === "background" || prev === "inactive";
      const goingBackground = next === "background" || next === "inactive";
      const becameActive = next === "active" && wasBackground;

      if (goingBackground || becameActive) {
        try {
          router.dismissTo("/(tabs)/home");
        } catch {
          router.replace("/(tabs)/home");
        }
      }
    };

    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [flowStatus, router]);

  return null;
}
