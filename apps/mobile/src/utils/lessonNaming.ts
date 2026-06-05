import { LESSON_GROUP_MINUTES } from "../constants/config";
import type { Recording } from "../types";
import { formatDateTime } from "./formatDate";

const PART_SUFFIX = / \(part \d+\)$/i;

export interface RecordingTitleSuggestion {
  title: string;
  lessonId: string;
  isContinuation: boolean;
  partNumber: number;
}

export function stripPartSuffix(title: string): string {
  return title.replace(PART_SUFFIX, "").trim();
}

export function suggestRecordingTitle(recordings: Recording[]): RecordingTitleSuggestion {
  const now = Date.now();
  const windowMs = LESSON_GROUP_MINUTES * 60 * 1000;
  const recent = recordings
    .filter((r) => now - new Date(r.createdAt).getTime() <= windowMs)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (recent.length === 0) {
    const lessonId = `lesson-${now}`;
    return {
      title: `Lecture ${formatDateTime(new Date().toISOString())}`,
      lessonId,
      isContinuation: false,
      partNumber: 1,
    };
  }

  const anchor = recent[0];
  const lessonId = anchor.lessonId ?? anchor.id;
  const sameLesson = recordings.filter(
    (r) => r.lessonId === lessonId || r.id === lessonId
  );
  const partNumber = sameLesson.length + 1;
  const baseTitle = stripPartSuffix(anchor.title);

  return {
    title: partNumber > 1 ? `${baseTitle} (part ${partNumber})` : baseTitle,
    lessonId,
    isContinuation: true,
    partNumber,
  };
}
