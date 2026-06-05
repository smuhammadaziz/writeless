import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import { AppState } from "react-native";
import { config, STORAGE_KEYS } from "../constants/config";
import { useRecordingStore } from "../store/recordingStore";
import { setItem, getItem, removeItem } from "../utils/storage";
import {
  ensureRecordingControlSetup,
  startRecordingControl,
  stopRecordingControl,
  subscribeRecordingControlEnded,
  updateRecordingControl,
  type RecordingControlLabels,
} from "./recordingControl";
import { navigateToHome } from "./recordingNavigation";

interface PersistedSession {
  activeRecordingId: string;
  startedAt: string;
  language: string;
}

let recordingInstance: Audio.Recording | null = null;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let meteringInterval: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: { remove: () => void } | null = null;
let controlEndedSubscription: { remove: () => void } | null = null;
let initialized = false;
let controlLabels: RecordingControlLabels = {
  title: "Record a lecture",
  recordingNow: "Recording",
  stop: "Stop",
};

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

async function persistSession(): Promise<void> {
  const state = useRecordingStore.getState();
  if (!state.activeRecordingId || state.flowStatus !== "recording") {
    await removeItem(STORAGE_KEYS.recordingSession);
    return;
  }
  await setItem<PersistedSession>(STORAGE_KEYS.recordingSession, {
    activeRecordingId: state.activeRecordingId,
    startedAt: state.sessionStartedAt ?? new Date().toISOString(),
    language: state.currentLanguage,
  });
}

async function clearSession(): Promise<void> {
  await removeItem(STORAGE_KEYS.recordingSession);
}

function clearIntervals(): void {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (meteringInterval) {
    clearInterval(meteringInterval);
    meteringInterval = null;
  }
}

async function updateMetering(): Promise<void> {
  if (!recordingInstance) return;
  try {
    const status = await recordingInstance.getStatusAsync();
    if (!status.isRecording || status.metering === undefined) {
      useRecordingStore.getState().setAudioLevel(0.15);
      return;
    }
    const db = status.metering;
    const normalized = Math.min(1, Math.max(0.08, (db + 50) / 50));
    useRecordingStore.getState().setAudioLevel(normalized);
  } catch {
    useRecordingStore.getState().setAudioLevel(0.12);
  }
}

async function tickTimer(): Promise<void> {
  const store = useRecordingStore.getState();
  const next = store.elapsedSeconds + 1;
  store.setElapsed(next);
  await updateRecordingControl(next, controlLabels);
  if (next >= config.maxRecordingSeconds) {
    const uri = await stopRecordingSession();
    store.setFlowStatus("idle");
    store.setActiveRecordingId(null);
    if (uri) {
      store.setPendingStop(uri, next);
    }
  }
}

export function initRecordingSessionLifecycle(labels: RecordingControlLabels): void {
  if (initialized) return;
  initialized = true;
  controlLabels = labels;

  void ensureRecordingControlSetup();
  void recoverInterruptedSession();

  controlEndedSubscription = subscribeRecordingControlEnded(() => {
    if (useRecordingStore.getState().flowStatus === "recording") {
      void stopRecordingSession().then((uri) => {
        const elapsed = useRecordingStore.getState().elapsedSeconds;
        if (uri) {
          useRecordingStore.getState().setPendingStop(uri, elapsed);
          navigateToHome();
        }
      });
    }
  });

  appStateSubscription = AppState.addEventListener("change", (next) => {
    if (next !== "active") return;
    if (useRecordingStore.getState().flowStatus !== "recording") return;
    void updateMetering();
  });
}

async function recoverInterruptedSession(): Promise<void> {
  const persisted = await getItem<PersistedSession>(STORAGE_KEYS.recordingSession);
  if (!persisted || recordingInstance) return;
  useRecordingStore.getState().setFlowStatus("idle");
  useRecordingStore.getState().setActiveRecordingId(null);
  await clearSession();
  await stopRecordingControl(0, controlLabels);
}

export async function startRecordingSession(
  recordingId: string,
  labels: RecordingControlLabels
): Promise<void> {
  controlLabels = labels;
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error("Microphone permission required");
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
    interruptionModeIOS: InterruptionModeIOS.DoNotMix,
    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(RECORDING_OPTIONS);
  await recording.startAsync();
  recordingInstance = recording;

  const store = useRecordingStore.getState();
  store.setActiveRecordingId(recordingId);
  store.setFlowStatus("recording");
  store.setElapsed(0);
  store.setAudioLevel(0.15);
  store.setSessionStartedAt(new Date().toISOString());
  await persistSession();

  await startRecordingControl(0, controlLabels);

  timerInterval = setInterval(() => {
    void tickTimer();
  }, 1000);

  meteringInterval = setInterval(() => {
    void updateMetering();
  }, 80);
}

export async function stopRecordingSession(): Promise<string | null> {
  clearIntervals();
  const elapsed = useRecordingStore.getState().elapsedSeconds;
  await stopRecordingControl(elapsed, controlLabels);
  await clearSession();

  const recording = recordingInstance;
  recordingInstance = null;

  if (!recording) {
    useRecordingStore.getState().setFlowStatus("idle");
    useRecordingStore.getState().setActiveRecordingId(null);
    useRecordingStore.getState().setAudioLevel(0);
    return null;
  }

  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    useRecordingStore.getState().setAudioLevel(0);
    return uri;
  } catch {
    useRecordingStore.getState().setAudioLevel(0);
    return null;
  }
}

export function isRecordingSessionActive(): boolean {
  return recordingInstance !== null;
}

export function teardownRecordingSession(): void {
  clearIntervals();
  controlEndedSubscription?.remove();
  appStateSubscription?.remove();
  controlEndedSubscription = null;
  appStateSubscription = null;
  initialized = false;
}
