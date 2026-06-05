import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { SaveRecordingModal } from "../../components/modals/SaveRecordingModal";
import { LiveWaveform } from "../../components/recording/LiveWaveform";
import { RecordingScreenHeader } from "../../components/recording/RecordingScreenHeader";
import { fontFamily, fontSize } from "../../constants/typography";
import { useRecording } from "../../hooks/useRecording";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { initRecordingSessionLifecycle } from "../../services/recordingSession";
import { useRecordingStore } from "../../store/recordingStore";
import { formatDuration } from "../../utils/formatDuration";
import { suggestRecordingTitle } from "../../utils/lessonNaming";

export default function ActiveRecordingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { elapsedSeconds, stopRecording } = useRecording();
  const flowStatus = useRecordingStore((s) => s.flowStatus);
  const pendingStopUri = useRecordingStore((s) => s.pendingStopUri);
  const pendingStopDuration = useRecordingStore((s) => s.pendingStopDuration);
  const setPendingStop = useRecordingStore((s) => s.setPendingStop);
  const currentTitle = useRecordingStore((s) => s.currentTitle);
  const recordings = useRecordingStore((s) => s.recordings);
  const pendingLessonId = useRecordingStore((s) => s.pendingLessonId);
  const [saveVisible, setSaveVisible] = useState(false);
  const [stopUri, setStopUri] = useState<string | null>(null);
  const [stopDuration, setStopDuration] = useState(0);

  useEffect(() => {
    initRecordingSessionLifecycle({
      title: t("recording.screenTitle"),
      recordingNow: t("recording.recordingNow"),
      stop: t("recording.stop"),
    });
  }, [t]);

  useEffect(() => {
    if (flowStatus !== "recording" && !pendingStopUri) {
      router.dismissTo("/(tabs)/home");
    }
  }, [flowStatus, pendingStopUri, router]);

  useEffect(() => {
    if (flowStatus !== "recording") return;

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        router.dismissTo("/(tabs)/home");
      }
    });
    return () => sub.remove();
  }, [flowStatus, router]);

  useEffect(() => {
    if (pendingStopUri) {
      setStopUri(pendingStopUri);
      setStopDuration(pendingStopDuration);
      setPendingStop(null, 0);
      setSaveVisible(true);
    }
  }, [pendingStopUri, pendingStopDuration, setPendingStop]);

  const suggestion = suggestRecordingTitle(recordings);
  const lessonHint = suggestion.isContinuation
    ? t("recording.lessonPartHint", { part: suggestion.partNumber })
    : undefined;

  const handleStop = async () => {
    const uri = await stopRecording();
    if (!uri) return;
    setStopUri(uri);
    setStopDuration(useRecordingStore.getState().elapsedSeconds || elapsedSeconds);
    setSaveVisible(true);
  };

  const handleSave = (title: string, folderId?: string) => {
    setSaveVisible(false);
    useRecordingStore.getState().setTitle(title);
    useRecordingStore.getState().setPendingStop(stopUri, stopDuration);
    useRecordingStore.getState().setPendingLessonId(pendingLessonId ?? suggestion.lessonId);
    router.replace({
      pathname: "/recording/preparing",
      params: { folderId: folderId ?? "", title },
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["left", "right", "bottom"]}>
      <RecordingScreenHeader onClose={() => void handleStop()} />

      <View style={[styles.body, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <LinearGradient
          colors={theme.isDark ? ["#2A2855", "#1A1A2E"] : ["#EEECFF", "#FFFFFF"]}
          style={[styles.card, { borderColor: theme.isDark ? "#3D3A6B" : "#E0DEFF" }]}
        >
          <View style={styles.liveRow}>
            <View style={styles.liveDot} />
            <Text style={[styles.liveLabel, { color: "#EF4444", fontFamily: fontFamily.semibold }]}>
              {t("recording.recordingNow")}
            </Text>
          </View>

          <Text style={[styles.timer, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
            {formatDuration(elapsedSeconds)}
          </Text>

          <LiveWaveform />

          <Text style={[styles.hint, { color: theme.textSecondary }]}>{t("recording.backgroundHint")}</Text>
        </LinearGradient>

        <Pressable
          onPress={() => void handleStop()}
          style={[styles.stopBtn, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="stop" size={22} color="#FFFFFF" />
          <Text style={styles.stopText}>{t("recording.tapToStop")}</Text>
        </Pressable>
      </View>

      <SaveRecordingModal
        visible={saveVisible}
        initialTitle={currentTitle || suggestion.title}
        lessonHint={lessonHint}
        onSave={handleSave}
        onClose={() => {
          setSaveVisible(false);
          if (stopUri) {
            useRecordingStore.getState().setPendingStop(stopUri, stopDuration);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { flex: 1, paddingHorizontal: 20, justifyContent: "center", gap: 20 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 12,
  },
  liveRow: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#EF4444" },
  liveLabel: { fontSize: fontSize.caption },
  timer: { fontSize: 48, letterSpacing: 1 },
  hint: { fontSize: fontSize.caption, textAlign: "center", lineHeight: 20, marginTop: 8 },
  stopBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  stopText: { color: "#FFFFFF", fontSize: fontSize.body, fontFamily: fontFamily.bold },
});
