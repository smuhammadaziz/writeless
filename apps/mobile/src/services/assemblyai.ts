import { config } from "../constants/config";
import type { AssemblyAIResult } from "../types";

const BASE = "https://api.assemblyai.com/v2";

function hasApiKey(): boolean {
  return (
    Boolean(config.assemblyAiApiKey) &&
    config.assemblyAiApiKey !== "your_assemblyai_api_key_here"
  );
}

export async function uploadAudioToAssemblyAI(
  audioUri: string
): Promise<string> {
  if (!hasApiKey()) {
    return "mock-transcript-id";
  }
  const response = await fetch(audioUri);
  const blob = await response.blob();
  const uploadRes = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: { authorization: config.assemblyAiApiKey },
    body: blob,
  });
  const data = (await uploadRes.json()) as { upload_url: string };
  return data.upload_url;
}

export async function startTranscription(
  audioUrl: string,
  language: string
): Promise<string> {
  if (!hasApiKey()) {
    return "mock-transcript-id";
  }
  const res = await fetch(`${BASE}/transcript`, {
    method: "POST",
    headers: {
      authorization: config.assemblyAiApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      audio_url: audioUrl,
      language_code: language === "uz" ? "uz" : language,
      speaker_labels: true,
      auto_chapters: true,
      iab_categories: true,
      summarization: true,
      summary_model: "informative",
      summary_type: "bullets",
      language_detection: true,
    }),
  });
  const data = (await res.json()) as { id: string };
  return data.id;
}

export async function pollTranscription(
  transcriptId: string
): Promise<AssemblyAIResult> {
  if (!hasApiKey()) {
    return getMockAssemblyResult();
  }
  let status = "processing";
  let result: AssemblyAIResult | null = null;
  while (status === "processing" || status === "queued") {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    const res = await fetch(`${BASE}/transcript/${transcriptId}`, {
      headers: { authorization: config.assemblyAiApiKey },
    });
    const data = (await res.json()) as AssemblyAIResult & { status: string };
    status = data.status;
    if (status === "completed") {
      result = data;
    }
    if (status === "error") {
      throw new Error("Transcription failed");
    }
  }
  if (!result) throw new Error("No transcript result");
  return result;
}

export function getMockAssemblyResult(): AssemblyAIResult {
  return {
    id: "mock",
    status: "completed",
    text: "Welcome to the lecture. Today we cover core concepts and practical examples.",
    summary:
      "- Core concepts introduced\n- Practical examples demonstrated\n- Q&A session at the end",
    chapters: [
      {
        start: 0,
        end: 300,
        headline: "Introduction",
        summary: "Course overview and objectives.",
        gist: "Intro",
      },
      {
        start: 300,
        end: 900,
        headline: "Main concepts",
        summary: "Deep dive into the topic.",
        gist: "Core",
      },
    ],
    utterances: [
      {
        speaker: "A",
        text: "Welcome everyone to today's lecture.",
        start: 0,
        end: 5,
        confidence: 0.98,
      },
      {
        speaker: "B",
        text: "Could you repeat the main definition?",
        start: 5,
        end: 12,
        confidence: 0.95,
      },
      {
        speaker: "A",
        text: "Certainly. The main definition is the foundation of our topic today.",
        start: 12,
        end: 22,
        confidence: 0.97,
      },
    ],
    iab_categories_result: {
      results: [{ labels: [{ label: "Education", relevance: 0.92 }] }],
      summary: { Education: 0.92 },
    },
  };
}
