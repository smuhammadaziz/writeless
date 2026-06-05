import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft2,
  ArrowRight2,
  Cards,
  Export,
  Hashtag,
  LampOn,
  MessageQuestion,
  Profile2User,
  TickCircle,
} from "iconsax-react-nativejs";
import { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppIcon } from "../../components/icons/AppIcon";
import { ChapterItem } from "../../components/notes/ChapterItem";
import { KeywordBadge } from "../../components/notes/KeywordBadge";
import { NoteSectionHeader } from "../../components/notes/NoteSectionHeader";
import { SummaryCard } from "../../components/notes/SummaryCard";
import { TranscriptDialog } from "../../components/notes/TranscriptDialog";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotesStore } from "../../store/notesStore";
import { useRecordingStore } from "../../store/recordingStore";
import { buildNoteShareMessage } from "../../utils/shareNote";

type TabKey = "summary" | "chapters" | "transcript" | "flashcards";

const TAB_KEYS: TabKey[] = ["summary", "chapters", "transcript", "flashcards"];

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const note = useNotesStore((s) => s.getNoteById(id ?? ""));
  const recordings = useRecordingStore((s) => s.recordings);
  const [tab, setTab] = useState<TabKey>("summary");
  const [cardIndex, setCardIndex] = useState(0);
  const flipped = useSharedValue(0);

  const recording = useMemo(
    () => (note ? recordings.find((r) => r.id === note.recordingId) : undefined),
    [note, recordings]
  );

  const speakerStats = useMemo(() => {
    if (!note) return { teacher: 78, students: 22 };
    const counts: Record<string, number> = {};
    for (const u of note.transcript) {
      counts[u.speaker] = (counts[u.speaker] ?? 0) + u.text.length;
    }
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    const teacherLen = counts[note.teacherSpeaker] ?? total * 0.78;
    const teacher = Math.round((teacherLen / total) * 100);
    return { teacher, students: 100 - teacher };
  }, [note]);

  const flipStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipped.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { rotateY: `${interpolate(flipped.value, [0, 1], [180, 360])}deg` },
    ],
    opacity: flipped.value > 0.5 ? 1 : 0,
  }));

  const tapFlip = Gesture.Tap().onEnd(() => {
    flipped.value = withSpring(flipped.value === 0 ? 1 : 0);
  });

  const handleShare = async () => {
    if (!note) return;
    const title = recording?.title ?? t("note.shareDefaultTitle");
    const message = buildNoteShareMessage({
      title,
      note,
      labels: {
        keyPoints: t("note.keyPoints"),
        keywords: t("note.keywords"),
        teacher: t("note.teacher"),
        students: t("note.students"),
        flashcards: t("note.flashcards"),
      },
    });

    try {
      const result = await Share.share({ message, title });
      if (result.action === Share.sharedAction) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch {
      Alert.alert(t("note.shareFailed"));
    }
  };

  if (!note) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textPrimary, textAlign: "center", marginTop: 40 }}>
          {t("note.notFound")}
        </Text>
      </SafeAreaView>
    );
  }

  const card = note.flashcards[cardIndex];

  return (
    <ErrorBoundary>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <AppIcon icon={ArrowLeft2} size={22} color={theme.textPrimary} variant="Outline" />
          </Pressable>

          <View style={styles.titleBlock}>
            <Text
              style={[styles.noteTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
              numberOfLines={2}
            >
              {recording?.title ?? t("note.shareDefaultTitle")}
            </Text>
            <Text style={[styles.noteMeta, { color: theme.textSecondary }]}>
              {t("note.metaStats", {
                chapters: note.chapters.length,
                points: note.keyPoints.length,
                cards: note.flashcards.length,
              })}
            </Text>
          </View>

          <Pressable
            onPress={() => void handleShare()}
            style={[styles.shareBtn, { backgroundColor: `${theme.primary}14`, borderColor: `${theme.primary}35` }]}
          >
            <AppIcon icon={Export} size={18} color={theme.primary} variant="Outline" />
            <Text style={[styles.shareLabel, { color: theme.primary, fontFamily: fontFamily.semibold }]}>
              {t("note.shareNote")}
            </Text>
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {TAB_KEYS.map((key) => {
            const active = tab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={[
                  styles.tabPill,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                  style={{
                    color: active ? "#FFFFFF" : theme.textSecondary,
                    fontFamily: active ? fontFamily.semibold : fontFamily.medium,
                    fontSize: fontSize.tiny,
                    textAlign: "center",
                  }}
                >
                  {t(`note.${key}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {tab === "summary" && (
            <Animated.View entering={FadeIn}>
              <SummaryCard summary={note.summary} />

              <View style={styles.section}>
                <NoteSectionHeader
                  icon={LampOn}
                  title={t("note.keyPoints")}
                  subtitle={t("note.keyPointsSub", { count: note.keyPoints.length })}
                />
                <View
                  style={[
                    styles.keyPointsCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  {note.keyPoints.map((point, index) => (
                    <View
                      key={point}
                      style={[
                        styles.keyPointRow,
                        index < note.keyPoints.length - 1 && {
                          borderBottomColor: theme.border,
                          borderBottomWidth: 1,
                        },
                      ]}
                    >
                      <View style={[styles.keyPointBadge, { backgroundColor: `${theme.primary}18` }]}>
                        <Text style={[styles.keyPointNum, { color: theme.primary, fontFamily: fontFamily.bold }]}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text style={[styles.keyPointText, { color: theme.textPrimary }]}>{point}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <NoteSectionHeader
                  icon={Hashtag}
                  title={t("note.keywords")}
                  subtitle={t("note.keywordsSub")}
                />
                <View style={styles.keywordWrap}>
                  {note.keywords.map((k) => (
                    <KeywordBadge key={k} keyword={k} />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <NoteSectionHeader
                  icon={Profile2User}
                  title={t("note.speakerBreakdown")}
                  subtitle={t("note.speakerBreakdownSub")}
                />
                <View
                  style={[
                    styles.speakerCard,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
                >
                  <View style={[styles.barTrack, { backgroundColor: `${theme.primary}18` }]}>
                    <View
                      style={[
                        styles.barFill,
                        { width: `${speakerStats.teacher}%`, backgroundColor: theme.primary },
                      ]}
                    />
                  </View>
                  <View style={styles.speakerLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: theme.primary }]} />
                      <Text style={[styles.legendText, { color: theme.textPrimary }]}>
                        {t("note.teacher")} · {speakerStats.teacher}%
                      </Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: theme.accent }]} />
                      <Text style={[styles.legendText, { color: theme.textPrimary }]}>
                        {t("note.students")} · {speakerStats.students}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {tab === "chapters" &&
            note.chapters.map((ch) => (
              <ChapterItem
                key={ch.headline}
                chapter={ch}
                onPress={() => setTab("transcript")}
              />
            ))}

          {tab === "transcript" && (
            <TranscriptDialog
              utterances={note.transcript}
              teacherSpeaker={note.teacherSpeaker}
              teacherLabel={t("note.teacher")}
              studentsLabel={t("note.students")}
            />
          )}

          {tab === "flashcards" && card && (
            <View style={styles.flashArea}>
              <View style={styles.flashProgress}>
                {note.flashcards.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.flashDot,
                      {
                        backgroundColor: i === cardIndex ? theme.primary : theme.border,
                        width: i === cardIndex ? 20 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.flashCounter, { color: theme.textSecondary }]}>
                {cardIndex + 1} / {note.flashcards.length}
              </Text>
              <GestureDetector gesture={tapFlip}>
                <View style={styles.flipContainer}>
                  <Animated.View
                    style={[
                      styles.flashCard,
                      flipStyle,
                      {
                        backgroundColor: theme.surface,
                        borderColor: `${theme.primary}40`,
                        shadowColor: theme.primary,
                      },
                    ]}
                  >
                    <View style={[styles.flashBadge, { backgroundColor: `${theme.primary}18` }]}>
                      <AppIcon icon={MessageQuestion} size={16} color={theme.primary} variant="Outline" />
                      <Text style={{ color: theme.primary, fontFamily: fontFamily.semibold, fontSize: fontSize.tiny }}>
                        {t("note.question")}
                      </Text>
                    </View>
                    <Text style={[styles.flashQ, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
                      {card.question}
                    </Text>
                    <Text style={[styles.flashTap, { color: theme.textSecondary }]}>
                      {t("note.tapToFlip")}
                    </Text>
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.flashCard,
                      styles.flashBack,
                      backStyle,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <View style={styles.flashBadgeAnswer}>
                      <AppIcon icon={TickCircle} size={16} color="#FFFFFF" variant="Bold" />
                      <Text style={{ color: "#FFFFFF", fontFamily: fontFamily.semibold, fontSize: fontSize.tiny }}>
                        {t("note.answer")}
                      </Text>
                    </View>
                    <Text style={[styles.flashQ, { color: "#FFFFFF", fontFamily: fontFamily.medium }]}>
                      {card.answer}
                    </Text>
                  </Animated.View>
                </View>
              </GestureDetector>
              <View style={styles.flashNav}>
                <Pressable
                  disabled={cardIndex === 0}
                  onPress={() => {
                    setCardIndex((i) => i - 1);
                    flipped.value = 0;
                  }}
                  style={[styles.flashNavBtn, { borderColor: theme.border, opacity: cardIndex === 0 ? 0.4 : 1 }]}
                >
                  <AppIcon icon={ArrowLeft2} size={22} color={theme.primary} variant="Outline" />
                </Pressable>
                <View style={[styles.flashNavMid, { backgroundColor: `${theme.primary}14` }]}>
                  <AppIcon icon={Cards} size={16} color={theme.primary} variant="Outline" />
                  <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: fontSize.caption }}>
                    {t("note.flashcards")}
                  </Text>
                </View>
                <Pressable
                  disabled={cardIndex >= note.flashcards.length - 1}
                  onPress={() => {
                    setCardIndex((i) => i + 1);
                    flipped.value = 0;
                  }}
                  style={[
                    styles.flashNavBtn,
                    {
                      borderColor: theme.border,
                      opacity: cardIndex >= note.flashcards.length - 1 ? 0.4 : 1,
                    },
                  ]}
                >
                  <AppIcon icon={ArrowRight2} size={22} color={theme.primary} variant="Outline" />
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { flex: 1, minWidth: 0, gap: 2 },
  noteTitle: { fontSize: fontSize.body, lineHeight: 22 },
  noteMeta: { fontSize: fontSize.tiny },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  shareLabel: { fontSize: fontSize.tiny },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 38,
  },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginTop: 22 },
  keyPointsCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  keyPointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  keyPointBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  keyPointNum: { fontSize: fontSize.caption },
  keyPointText: { flex: 1, lineHeight: 22, fontSize: fontSize.body },
  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  speakerCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  barTrack: { height: 10, borderRadius: 5, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 5 },
  speakerLegend: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: fontSize.caption, fontFamily: fontFamily.medium },
  flashArea: {
    alignItems: "center",
    width: "100%",
    paddingTop: 8,
  },
  flashProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  flashDot: { height: 8, borderRadius: 4 },
  flashCounter: { fontSize: fontSize.caption, marginBottom: 12 },
  flipContainer: {
    width: "100%",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  flashCard: {
    position: "absolute",
    width: "100%",
    height: 260,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    justifyContent: "center",
    backfaceVisibility: "hidden",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
  flashBack: { top: 0, left: 0 },
  flashBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  flashBadgeAnswer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  flashQ: { fontSize: fontSize.subtitle, textAlign: "center", lineHeight: 28 },
  flashTap: { marginTop: 16, textAlign: "center", fontSize: fontSize.caption },
  flashNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    width: "100%",
    marginTop: 20,
  },
  flashNavBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flashNavMid: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
