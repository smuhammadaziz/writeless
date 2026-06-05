import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Loader } from "../../components/ui/Loader";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { processAudioToNote } from "../../services/notePipeline";
import { scheduleNotesReadyNotification } from "../../services/recordingNotifications";
import { useAuthStore } from "../../store/authStore";
import { useNotesStore } from "../../store/notesStore";
import { useRecordingStore } from "../../store/recordingStore";

export default function PreparingNotesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ title?: string; folderId?: string }>();
  const userId = useAuthStore((s) => s.user?.id) ?? "local";
  const pendingStopUri = useRecordingStore((s) => s.pendingStopUri);
  const pendingStopDuration = useRecordingStore((s) => s.pendingStopDuration);
  const pendingLessonId = useRecordingStore((s) => s.pendingLessonId);
  const currentLanguage = useRecordingStore((s) => s.currentLanguage);
  const addRecording = useRecordingStore((s) => s.addRecording);
  const updateRecording = useRecordingStore((s) => s.updateRecording);
  const addNote = useNotesStore((s) => s.addNote);
  const setPendingStop = useRecordingStore((s) => s.setPendingStop);
  const [step, setStep] = useState(0);

  const steps = ["preparingStep1", "preparingStep2", "preparingStep3"] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }, 2200);
    return () => clearInterval(interval);
  }, [steps.length]);

  const started = useRef(false);

  useEffect(() => {
    const uri = pendingStopUri;
    if (!uri || started.current) {
      if (!uri) router.replace("/(tabs)/home");
      return;
    }
    started.current = true;

    const title = (params.title as string) || "Lecture";
    const folderId = params.folderId ? String(params.folderId) : undefined;
    const recordingId = `rec-${Date.now()}`;

    addRecording({
      id: recordingId,
      userId,
      title,
      duration: pendingStopDuration,
      audioUri: uri,
      language: currentLanguage,
      status: "processing",
      folderId: folderId || undefined,
      lessonId: pendingLessonId ?? recordingId,
      createdAt: new Date().toISOString(),
    });

    setPendingStop(null, 0);

    void (async () => {
      try {
        const note = await processAudioToNote(uri, recordingId, currentLanguage);
        addNote(note);
        updateRecording(recordingId, { status: "done" });
        await scheduleNotesReadyNotification(
          t("recording.notifyReadyTitle"),
          t("recording.notifyReadyBody", { title }),
          note.id
        );
        router.replace(`/note/${note.id}`);
      } catch {
        updateRecording(recordingId, { status: "failed" });
        router.replace("/(tabs)/home");
      }
    })();
  }, [
    addNote,
    addRecording,
    currentLanguage,
    params.folderId,
    params.title,
    pendingLessonId,
    pendingStopDuration,
    pendingStopUri,
    router,
    setPendingStop,
    t,
    updateRecording,
    userId,
  ]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.center, { paddingBottom: insets.bottom + 32 }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Loader size={64} />
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary, fontFamily: fontFamily.bold },
            ]}
          >
            {t("recording.preparingTitle")}
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            {t("recording.preparingSub")}
          </Text>
          <View style={[styles.etaBox, { backgroundColor: `${theme.primary}12` }]}>
            <Ionicons name="notifications-outline" size={18} color={theme.primary} />
            <Text style={[styles.etaText, { color: theme.primary }]}>
              {t("recording.preparingEta")}
            </Text>
          </View>
          {steps.map((key, i) =>
            i <= step ? (
              <Animated.View key={key} entering={FadeInDown.delay(i * 150)}>
                <Text style={[styles.stepLine, { color: theme.textSecondary }]}>
                  ✓ {t(`recording.${key}`)}
                </Text>
              </Animated.View>
            ) : null
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },
  title: { fontSize: fontSize.title, marginTop: 20, textAlign: "center" },
  sub: { fontSize: fontSize.body, textAlign: "center", lineHeight: 22 },
  etaBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    width: "100%",
  },
  etaText: { flex: 1, fontSize: fontSize.caption, lineHeight: 18, fontFamily: fontFamily.medium },
  stepLine: { fontSize: fontSize.caption, alignSelf: "flex-start", width: "100%", marginTop: 6 },
});
