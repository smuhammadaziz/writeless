export type AppLanguage = "en" | "uz" | "ru";
export type ThemePreference = "light" | "dark" | "system";
export type RecordingLanguage = AppLanguage;
export type RecordingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "done"
  | "failed";

export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

export interface Recording {
  id: string;
  userId: string;
  title: string;
  duration: number;
  audioUri: string;
  language: RecordingLanguage;
  status: RecordingStatus;
  folderId?: string;
  /** Groups multiple recordings into one lecture session */
  lessonId?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  recordingId: string;
  summary: string;
  keyPoints: string[];
  keywords: string[];
  chapters: Chapter[];
  transcript: Utterance[];
  flashcards: Flashcard[];
  teacherSpeaker: string;
  createdAt: string;
}

export interface Chapter {
  start: number;
  end: number;
  headline: string;
  summary: string;
  gist: string;
}

export interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export type FolderIconId =
  | "folder"
  | "laptop"
  | "flask"
  | "ruler"
  | "library"
  | "palette"
  | "dna"
  | "scroll"
  | "book"
  | "microscope";

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: FolderIconId;
  noteCount: number;
  createdAt: string;
}

export interface AssemblyAIResult {
  id: string;
  status: string;
  text: string;
  summary: string;
  chapters: Chapter[];
  utterances: Array<{
    speaker: string;
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  iab_categories_result: {
    results: Array<{ labels: Array<{ label: string; relevance: number }> }>;
    summary: Record<string, number>;
  };
}

export interface OpenAINoteExtraction {
  keyPoints: string[];
  keywords: string[];
  flashcards: Flashcard[];
  teacherSpeaker: string;
}

export interface PendingUpload {
  id: string;
  audioUri: string;
  title: string;
  language: RecordingLanguage;
  createdAt: string;
}
