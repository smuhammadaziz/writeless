import { config } from "../constants/config";
import type { OpenAINoteExtraction } from "../types";

const SYSTEM_PROMPT = `You are an expert academic note-taker. Given a lecture transcript, extract:
1. 8–12 of the most important key points students must remember (concise bullets; prioritize teacher explanations, definitions, exam-worthy facts, and steps)
2. 10 important keywords or terms
3. 6–8 flashcard question-answer pairs for revision
4. Identify which speaker is likely the teacher (speaks most, gives explanations)
Return ONLY a JSON object with keys: keyPoints (string[]), keywords (string[]), flashcards (Array<{question: string, answer: string}>), teacherSpeaker (string)`;

function hasApiKey(): boolean {
  return (
    Boolean(config.openAiApiKey) &&
    config.openAiApiKey !== "your_openai_api_key_here"
  );
}

export async function extractNotesFromTranscript(
  transcript: string
): Promise<OpenAINoteExtraction> {
  if (!hasApiKey()) {
    return getMockExtraction();
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openAiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: transcript },
      ],
      temperature: 0.3,
    }),
  });
  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const content = data.choices[0]?.message?.content ?? "{}";
  return JSON.parse(content) as OpenAINoteExtraction;
}

export function getMockExtraction(): OpenAINoteExtraction {
  return {
    keyPoints: [
      "Core definitions establish the foundation of the topic",
      "Supervised vs unsupervised learning solves different problem types",
      "Linear regression models relationships with a hypothesis function",
      "Gradient descent iteratively minimizes the cost function",
      "Overfitting happens when the model memorizes training noise",
      "Cross-validation estimates how well the model generalizes",
      "Feature scaling can speed up optimization convergence",
      "Regularization reduces variance and improves test performance",
      "Neural networks stack non-linear transformations for complex patterns",
      "Always split data into train/validation/test for honest evaluation",
    ],
    keywords: [
      "Lecture",
      "Concept",
      "Definition",
      "Example",
      "Theory",
      "Practice",
      "Review",
      "Summary",
      "Question",
      "Answer",
    ],
    flashcards: [
      {
        question: "What is the main topic of this lecture?",
        answer: "Core academic concepts with practical examples.",
      },
      {
        question: "Why are examples important?",
        answer: "They connect abstract theory to real understanding.",
      },
      {
        question: "How should you review lecture notes?",
        answer: "Use key points, flashcards, and chapter summaries.",
      },
      {
        question: "Who is likely the teacher?",
        answer: "Speaker A — they lead and explain most content.",
      },
      {
        question: "What improves retention?",
        answer: "Active recall using flashcards and spaced repetition.",
      },
    ],
    teacherSpeaker: "A",
  };
}
