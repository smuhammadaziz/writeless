/** Maximum length of a single recording session */
export const MAX_RECORDING_MINUTES = 30;

export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001",
  googleWebClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
    "your_google_web_client_id_here",
  assemblyAiApiKey:
    process.env.EXPO_PUBLIC_ASSEMBLYAI_API_KEY ?? "your_assemblyai_api_key_here",
  openAiApiKey:
    process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? "your_openai_api_key_here",
  maxRecordingSeconds: MAX_RECORDING_MINUTES * 60,
  splashDurationMs: 2500,
} as const;

/** If a new recording starts within this window, treat it as the same lesson */
export const LESSON_GROUP_MINUTES = 10;

export const STORAGE_KEYS = {
  token: "writeless_token",
  user: "writeless_user",
  language: "writeless_language",
  onboardingDone: "writeless_onboarding_done",
  languageChosen: "writeless_language_chosen",
  theme: "writeless_theme",
  uploadQueue: "writeless_upload_queue",
  recordingSession: "writeless_recording_session",
} as const;
