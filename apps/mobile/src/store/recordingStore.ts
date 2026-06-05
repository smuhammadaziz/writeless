import { create } from "zustand";
import { buildDemoRecordings } from "../data/demoContent";
import type { Recording, RecordingLanguage, RecordingStatus } from "../types";

interface RecordingState {
  activeRecordingId: string | null;
  recordings: Recording[];
  flowStatus: "idle" | "recording" | "processing" | "done";
  currentTitle: string;
  currentLanguage: RecordingLanguage;
  elapsedSeconds: number;
  audioLevel: number;
  sessionStartedAt: string | null;
  pendingLessonId: string | null;
  pendingStopUri: string | null;
  pendingStopDuration: number;
  lastNoteId: string | null;
  setFlowStatus: (status: RecordingState["flowStatus"]) => void;
  setTitle: (title: string) => void;
  setLanguage: (lang: RecordingLanguage) => void;
  setElapsed: (seconds: number) => void;
  setAudioLevel: (level: number) => void;
  setActiveRecordingId: (id: string | null) => void;
  setSessionStartedAt: (iso: string | null) => void;
  setPendingLessonId: (id: string | null) => void;
  setPendingStop: (uri: string | null, duration: number) => void;
  addRecording: (recording: Recording) => void;
  updateRecording: (id: string, patch: Partial<Recording>) => void;
  setLastNoteId: (id: string | null) => void;
  seedDemo: (userId: string) => void;
}

export const useRecordingStore = create<RecordingState>((set) => ({
  activeRecordingId: null,
  recordings: [],
  flowStatus: "idle",
  currentTitle: "",
  currentLanguage: "en",
  elapsedSeconds: 0,
  audioLevel: 0.12,
  sessionStartedAt: null,
  pendingLessonId: null,
  pendingStopUri: null,
  pendingStopDuration: 0,
  lastNoteId: null,
  setFlowStatus: (flowStatus) => set({ flowStatus }),
  setTitle: (currentTitle) => set({ currentTitle }),
  setLanguage: (currentLanguage) => set({ currentLanguage }),
  setElapsed: (elapsedSeconds) => set({ elapsedSeconds }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  setActiveRecordingId: (activeRecordingId) => set({ activeRecordingId }),
  setSessionStartedAt: (sessionStartedAt) => set({ sessionStartedAt }),
  setPendingLessonId: (pendingLessonId) => set({ pendingLessonId }),
  setPendingStop: (pendingStopUri, pendingStopDuration) =>
    set({ pendingStopUri, pendingStopDuration }),
  addRecording: (recording) =>
    set((s) => ({ recordings: [recording, ...s.recordings] })),
  updateRecording: (id, patch) =>
    set((s) => ({
      recordings: s.recordings.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    })),
  setLastNoteId: (lastNoteId) => set({ lastNoteId }),
  seedDemo: (userId) => {
    set({ recordings: buildDemoRecordings(userId) });
  },
}));
