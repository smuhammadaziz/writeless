import { create } from "zustand";
import { buildDemoFolders, buildDemoNotes } from "../data/demoContent";
import type { Folder, Note } from "../types";

interface NotesState {
  notes: Note[];
  folders: Folder[];
  getNoteById: (id: string) => Note | undefined;
  getNoteByRecordingId: (recordingId: string) => Note | undefined;
  addNote: (note: Note) => void;
  addFolder: (folder: Folder) => void;
  seedDemo: (userId: string) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  folders: [],
  getNoteById: (id) => get().notes.find((n) => n.id === id),
  getNoteByRecordingId: (recordingId) =>
    get().notes.find((n) => n.recordingId === recordingId),
  addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
  addFolder: (folder) => set((s) => ({ folders: [...s.folders, folder] })),
  seedDemo: (userId) => {
    set({
      notes: buildDemoNotes(),
      folders: buildDemoFolders(userId),
    });
  },
}));
