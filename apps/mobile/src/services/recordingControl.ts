import * as LiveActivity from "expo-live-activity";
import { NativeModules, Platform } from "react-native";
import { config } from "../constants/config";
import { formatDuration } from "../utils/formatDuration";

let liveActivityId: string | undefined;
let maxRecordingSeconds = config.maxRecordingSeconds;

/** Live Activities need a dev build — native module is null in Expo Go. */
export function isLiveActivitySupported(): boolean {
  if (Platform.OS !== "ios") return false;
  return NativeModules.ExpoLiveActivity != null;
}

export type RecordingControlLabels = {
  title: string;
  recordingNow: string;
  stop: string;
};

function recordingEndTimestamp(elapsedSeconds: number): number {
  const remaining = Math.max(0, maxRecordingSeconds - elapsedSeconds);
  return Date.now() + remaining * 1000;
}

function liveActivityState(elapsedSeconds: number, labels: RecordingControlLabels) {
  return {
    title: labels.title,
    subtitle: `${labels.recordingNow} · ${formatDuration(elapsedSeconds)}`,
    progressBar: {
      date: recordingEndTimestamp(elapsedSeconds),
    },
  };
}

const liveActivityConfig: LiveActivity.LiveActivityConfig = {
  backgroundColor: "#6C63FF",
  titleColor: "#FFFFFF",
  subtitleColor: "#F0EEFF",
  progressViewTint: "#FFFFFF",
  progressViewLabelColor: "#F5F5FF",
  deepLinkUrl: "/(tabs)/home",
  timerType: "digital",
};

export async function ensureRecordingControlSetup(): Promise<void> {
  /* iOS Live Activity only — no notification channel setup */
}

export async function startRecordingControl(
  elapsedSeconds: number,
  labels: RecordingControlLabels
): Promise<void> {
  maxRecordingSeconds = config.maxRecordingSeconds;

  if (!isLiveActivitySupported()) return;

  try {
    const id = LiveActivity.startActivity(
      liveActivityState(elapsedSeconds, labels),
      liveActivityConfig
    );
    liveActivityId = id ?? undefined;
  } catch {
    liveActivityId = undefined;
  }
}

/** Updates lock screen / Dynamic Island timer in place. */
export async function updateRecordingControl(
  elapsedSeconds: number,
  labels: RecordingControlLabels
): Promise<void> {
  if (!isLiveActivitySupported() || !liveActivityId) return;

  try {
    LiveActivity.updateActivity(liveActivityId, liveActivityState(elapsedSeconds, labels));
  } catch {
    /* native module unavailable */
  }
}

export async function stopRecordingControl(
  elapsedSeconds: number,
  labels: RecordingControlLabels
): Promise<void> {
  if (!isLiveActivitySupported() || !liveActivityId) return;

  try {
    LiveActivity.stopActivity(liveActivityId, {
      title: labels.title,
      subtitle: formatDuration(elapsedSeconds),
      progressBar: { progress: 1 },
    });
  } catch {
    /* ignore */
  }
  liveActivityId = undefined;
}

export function subscribeRecordingControlEnded(
  onStopRequested: () => void
): { remove: () => void } {
  if (!isLiveActivitySupported()) {
    return { remove: () => undefined };
  }

  try {
    const sub = LiveActivity.addActivityUpdatesListener((event) => {
      if (
        event.activityID === liveActivityId &&
        (event.activityState === "ended" || event.activityState === "dismissed")
      ) {
        onStopRequested();
      }
    });
    return { remove: () => sub?.remove() };
  } catch {
    return { remove: () => undefined };
  }
}
