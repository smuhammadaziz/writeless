import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SaveRecordingModal } from "../modals/SaveRecordingModal";
import { useTranslation } from "../../hooks/useTranslation";
import { useRecordingStore } from "../../store/recordingStore";
import { suggestRecordingTitle } from "../../utils/lessonNaming";

/** Shows save sheet on home when recording was stopped from lock screen / background. */
export function PendingRecordingSave() {
  const router = useRouter();
  const { t } = useTranslation();
  const pendingStopUri = useRecordingStore((s) => s.pendingStopUri);
  const pendingStopDuration = useRecordingStore((s) => s.pendingStopDuration);
  const pendingLessonId = useRecordingStore((s) => s.pendingLessonId);
  const currentTitle = useRecordingStore((s) => s.currentTitle);
  const recordings = useRecordingStore((s) => s.recordings);
  const setPendingStop = useRecordingStore((s) => s.setPendingStop);
  const setPendingLessonId = useRecordingStore((s) => s.setPendingLessonId);
  const setTitle = useRecordingStore((s) => s.setTitle);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pendingStopUri) setVisible(true);
  }, [pendingStopUri]);

  if (!pendingStopUri || !visible) return null;

  const suggestion = suggestRecordingTitle(recordings);
  const lessonHint = suggestion.isContinuation
    ? t("recording.lessonPartHint", { part: suggestion.partNumber })
    : undefined;

  const handleSave = (title: string, folderId?: string) => {
    setVisible(false);
    setTitle(title);
    setPendingLessonId(pendingLessonId ?? suggestion.lessonId);
    router.replace({
      pathname: "/recording/preparing",
      params: { folderId: folderId ?? "", title },
    });
  };

  return (
    <SaveRecordingModal
      visible={visible}
      initialTitle={currentTitle || suggestion.title}
      lessonHint={lessonHint}
      onSave={handleSave}
      onClose={() => {
        setVisible(false);
        setPendingStop(pendingStopUri, pendingStopDuration);
      }}
    />
  );
}
