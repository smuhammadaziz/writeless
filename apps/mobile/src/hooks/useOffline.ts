import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { STORAGE_KEYS } from "../constants/config";
import { processUploadedAudio } from "../services/notePipeline";
import { useNotesStore } from "../store/notesStore";
import { useRecordingStore } from "../store/recordingStore";
import type { PendingUpload } from "../types";
import { getItem, setItem } from "../utils/storage";

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const addNote = useNotesStore((s) => s.addNote);
  const addRecording = useRecordingStore((s) => s.addRecording);

  const flushQueue = async () => {
    const queue = (await getItem<PendingUpload[]>(STORAGE_KEYS.uploadQueue)) ?? [];
    if (queue.length === 0) return;
    const remaining: PendingUpload[] = [];
    for (const item of queue) {
      try {
        const { recordingId, note } = await processUploadedAudio(
          item.audioUri,
          item.language,
          item.title
        );
        addNote(note);
        addRecording({
          id: recordingId,
          userId: "local",
          title: item.title,
          duration: 0,
          audioUri: item.audioUri,
          language: item.language,
          status: "done",
          createdAt: item.createdAt,
        });
      } catch {
        remaining.push(item);
      }
    }
    await setItem(STORAGE_KEYS.uploadQueue, remaining);
  };

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable !== false);
      setIsOffline(offline);
      if (!offline) void flushQueue();
    });
    const sub = AppState.addEventListener("change", (status) => {
      if (status === "active") void flushQueue();
    });
    return () => {
      unsub();
      sub.remove();
    };
  }, []);

  return { isOffline };
}
