import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecordingScreenHeader } from "../../components/recording/RecordingScreenHeader";
import { RecordingSetupPanel } from "../../components/recording/RecordingSetupPanel";
import { useRecording } from "../../hooks/useRecording";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useRecordingStore } from "../../store/recordingStore";
import { useSettingsStore } from "../../store/settingsStore";
import { suggestRecordingTitle } from "../../utils/lessonNaming";

export default function RecordingSetupScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { startRecording } = useRecording();
  const currentLanguage = useRecordingStore((s) => s.currentLanguage);
  const setLanguage = useRecordingStore((s) => s.setLanguage);
  const setTitle = useRecordingStore((s) => s.setTitle);
  const setPendingLessonId = useRecordingStore((s) => s.setPendingLessonId);
  const recordings = useRecordingStore((s) => s.recordings);
  const flowStatus = useRecordingStore((s) => s.flowStatus);
  const appLanguage = useSettingsStore((s) => s.language);

  useEffect(() => {
    setLanguage(appLanguage);
  }, [appLanguage, setLanguage]);

  useEffect(() => {
    if (flowStatus === "recording") {
      router.dismissTo("/(tabs)/home");
    }
  }, [flowStatus, router]);

  const handleStart = async () => {
    const suggestion = suggestRecordingTitle(recordings);
    setPendingLessonId(suggestion.lessonId);
    setTitle(suggestion.title);
    const recordingId = `rec-${Date.now()}`;
    await startRecording(recordingId, {
      title: t("recording.screenTitle"),
      recordingNow: t("recording.recordingNow"),
      stop: t("recording.stop"),
    });
    router.dismissTo("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={["left", "right", "bottom"]}>
      <RecordingScreenHeader
        onClose={() => router.back()}
        title={t("recording.screenTitle")}
        subtitle={t("recording.screenSub")}
      />
      <RecordingSetupPanel
        currentLanguage={currentLanguage}
        onSelectLanguage={setLanguage}
        onStart={() => void handleStart()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
