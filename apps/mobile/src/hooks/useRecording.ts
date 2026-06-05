import { useCallback } from "react";
import type { RecordingControlLabels } from "../services/recordingControl";
import {
  startRecordingSession,
  stopRecordingSession,
} from "../services/recordingSession";
import { useRecordingStore } from "../store/recordingStore";

export function useRecording() {
  const elapsedSeconds = useRecordingStore((s) => s.elapsedSeconds);
  const audioLevel = useRecordingStore((s) => s.audioLevel);

  const startRecording = useCallback(
    async (recordingId: string, labels: RecordingControlLabels) => {
      await startRecordingSession(recordingId, labels);
    },
    []
  );

  const stopRecording = useCallback(async (): Promise<string | null> => {
    const uri = await stopRecordingSession();
    useRecordingStore.getState().setFlowStatus("idle");
    useRecordingStore.getState().setActiveRecordingId(null);
    return uri;
  }, []);

  return {
    elapsedSeconds,
    audioLevel,
    startRecording,
    stopRecording,
  };
}
