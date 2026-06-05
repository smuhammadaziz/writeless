import { buildDemoFolders, buildDemoNotes, buildDemoRecordings } from "../data/demoContent";
import { useNotesStore } from "../store/notesStore";
import { useRecordingStore } from "../store/recordingStore";

/** Re-seeds demo library after hot reload when auth persists but in-memory store was cleared. */
export function ensureDemoContent(userId: string): void {
  const { recordings } = useRecordingStore.getState();
  if (recordings.length > 0) return;

  useRecordingStore.setState({ recordings: buildDemoRecordings(userId) });
  useNotesStore.setState({
    notes: buildDemoNotes(),
    folders: buildDemoFolders(userId),
  });
}
