import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { processUploadedAudio } from "../services/notePipeline";
import { useAuthStore } from "../store/authStore";
import { useNotesStore } from "../store/notesStore";
import { useRecordingStore } from "../store/recordingStore";
import { useSettingsStore } from "../store/settingsStore";
import { defaultRecordingTitle } from "../utils/formatDate";

export function useAudioUpload() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const language = useSettingsStore((s) => s.language);
  const userId = useAuthStore((s) => s.user?.id) ?? "local";
  const addNote = useNotesStore((s) => s.addNote);
  const addRecording = useRecordingStore((s) => s.addRecording);

  const pickAndProcess = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["audio/*"],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const uri = result.assets[0].uri;
      const title = defaultRecordingTitle();
      const { recordingId, note } = await processUploadedAudio(uri, language, title);

      addNote(note);
      addRecording({
        id: recordingId,
        userId,
        title,
        duration: 0,
        audioUri: uri,
        language,
        status: "done",
        createdAt: new Date().toISOString(),
      });

      router.push(`/note/${note.id}`);
    } finally {
      setUploading(false);
    }
  }, [addNote, addRecording, language, router, userId]);

  return { uploading, pickAndProcess };
}
