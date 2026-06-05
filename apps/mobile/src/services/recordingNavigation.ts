import { useRecordingStore } from "../store/recordingStore";

let resetToHome: (() => void) | null = null;

export function registerRecordingHomeNavigation(fn: () => void): void {
  resetToHome = fn;
}

export function clearRecordingHomeNavigation(): void {
  resetToHome = null;
}

/** Closes any recording modal stack and lands on home. */
export function navigateToHome(): void {
  resetToHome?.();
}

export function navigateToHomeWhileRecording(): void {
  if (useRecordingStore.getState().flowStatus !== "recording") return;
  navigateToHome();
}
