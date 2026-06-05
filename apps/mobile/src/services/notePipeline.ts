import {
  getMockAssemblyResult,
  pollTranscription,
  startTranscription,
  uploadAudioToAssemblyAI,
} from "./assemblyai";
import { extractNotesFromTranscript, getMockExtraction } from "./openai";
import type { Note, RecordingLanguage, Utterance } from "../types";

export async function processAudioToNote(
  audioUri: string,
  recordingId: string,
  language: RecordingLanguage
): Promise<Note> {
  const uploadUrl = await uploadAudioToAssemblyAI(audioUri);
  const transcriptId = await startTranscription(uploadUrl, language);
  const assembly =
    transcriptId === "mock-transcript-id"
      ? getMockAssemblyResult()
      : await pollTranscription(transcriptId);
  const extraction = await extractNotesFromTranscript(assembly.text);

  const transcript: Utterance[] = assembly.utterances.map((u) => ({
    speaker: u.speaker,
    text: u.text,
    start: u.start / 1000,
    end: u.end / 1000,
  }));

  return {
    id: `note-${Date.now()}`,
    recordingId,
    summary: assembly.summary.replace(/^- /gm, "").trim() || assembly.text.slice(0, 200),
    keyPoints: extraction.keyPoints,
    keywords: extraction.keywords,
    chapters: assembly.chapters.map((c) => ({
      ...c,
      start: c.start / 1000,
      end: c.end / 1000,
    })),
    transcript,
    flashcards: extraction.flashcards,
    teacherSpeaker: extraction.teacherSpeaker,
    createdAt: new Date().toISOString(),
  };
}

export async function processUploadedAudio(
  audioUri: string,
  language: RecordingLanguage,
  title: string
): Promise<{ recordingId: string; note: Note }> {
  const recordingId = `rec-${Date.now()}`;
  const note = await processAudioToNote(audioUri, recordingId, language);
  return { recordingId, note };
}
