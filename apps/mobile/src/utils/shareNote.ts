import type { Note } from "../types";

interface ShareNoteInput {
  title: string;
  note: Note;
  labels: {
    keyPoints: string;
    keywords: string;
    teacher: string;
    students: string;
    flashcards: string;
  };
}

export function buildNoteShareMessage({ title, note, labels }: ShareNoteInput): string {
  const lines = [
    title,
    "—".repeat(24),
    "",
    note.summary,
    "",
    labels.keyPoints,
    ...note.keyPoints.map((point) => `• ${point}`),
    "",
    `${labels.keywords}: ${note.keywords.join(", ")}`,
  ];

  if (note.flashcards.length > 0) {
    lines.push("", `${labels.flashcards}: ${note.flashcards.length}`);
  }

  lines.push("", "— Writeless");
  return lines.join("\n");
}
