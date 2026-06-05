import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Book1,
  Bookmark,
  Cards,
  LampOn,
  NoteText,
  type Icon,
} from "iconsax-react-nativejs";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from "react-native";
import { AppIcon } from "../icons/AppIcon";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import type { Note, Recording } from "../../types";
import { formatDuration } from "../../utils/formatDuration";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HOME_PAD = 20;
const CONTENT_WIDTH = SCREEN_WIDTH - HOME_PAD * 2;
const PEEK = 28;
const CARD_WIDTH = CONTENT_WIDTH - PEEK;
const CARD_GAP = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;
const CARD_HEIGHT = 220;
const STAGE_HEIGHT = CARD_HEIGHT + 24;
const CARD_RADIUS = 24;
const TILTS = [-6, 5, -5, 6, -4];

const RECORDING_GRADIENTS: [string, string][] = [
  ["#1A1A2E", "#3D3A6B"],
  ["#6C63FF", "#8B83FF"],
  ["#4F46E5", "#6C63FF"],
  ["#2D2D44", "#6C63FF"],
];

type CarouselItem =
  | { kind: "recording"; recording: Recording; note?: Note; subjectLabel?: string; index: number }
  | { kind: "see-all"; index: number };

interface RecentRecordingsCarouselProps {
  recordings: Recording[];
  getNote: (recordingId: string) => Note | undefined;
  getSubjectLabel: (folderId?: string) => string | undefined;
}

export function RecentRecordingsCarousel({
  recordings,
  getNote,
  getSubjectLabel,
}: RecentRecordingsCarouselProps) {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const recent = recordings.slice(0, 4);
  const items: CarouselItem[] = [
    ...recent.map((recording, index) => ({
      kind: "recording" as const,
      recording,
      note: getNote(recording.id),
      subjectLabel: getSubjectLabel(recording.folderId),
      index,
    })),
    { kind: "see-all" as const, index: 4 },
  ];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / SNAP_INTERVAL);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
  };

  const cardTilt = (index: number) => {
    if (index === activeIndex) return "0deg";
    return `${TILTS[index % TILTS.length]}deg`;
  };

  const renderItem: ListRenderItem<CarouselItem> = ({ item }) => {
    const isActive = item.index === activeIndex;
    const tilt = cardTilt(item.index);

    if (item.kind === "see-all") {
      return (
        <Pressable
          onPress={() => router.push("/(tabs)/library")}
          style={({ pressed }) => [
            styles.cardShell,
            {
              transform: [{ rotate: tilt }, { scale: isActive ? 1 : 0.97 }],
            },
            pressed && styles.cardPressed,
          ]}
        >
          <LinearGradient
            colors={theme.isDark ? ["#2A2855", "#1A1A2E"] : ["#EEECFF", "#FFFFFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.card,
              styles.seeAllCard,
              { borderColor: theme.isDark ? "#4A4780" : "#D8D4FF" },
            ]}
          >
            <View style={[styles.seeAllIconRing, { backgroundColor: `${theme.primary}20` }]}>
              <AppIcon icon={Book1} size={28} color={theme.primary} variant="Outline" />
            </View>
            <Text
              style={[
                styles.seeAllTitle,
                { color: theme.textPrimary, fontFamily: fontFamily.bold },
              ]}
            >
              {t("home.seeAllCardTitle")}
            </Text>
            <Text style={[styles.seeAllSub, { color: theme.textSecondary }]}>
              {t("home.seeAllCardSub", { count: recordings.length })}
            </Text>
            <View style={[styles.seeAllCta, { backgroundColor: theme.primary }]}>
              <Text style={styles.seeAllCtaText}>{t("home.seeAll")}</Text>
              <AppIcon icon={ArrowRight} size={16} color="#FFFFFF" variant="Outline" />
            </View>
          </LinearGradient>
        </Pressable>
      );
    }

    const { recording, note, subjectLabel } = item;
    const colors = RECORDING_GRADIENTS[item.index % RECORDING_GRADIENTS.length];
    const isProcessing =
      recording.status === "processing" || recording.status === "uploading";
    const chapter = note?.chapters?.[0]?.headline;
    const topPoint = note?.keyPoints?.[0];

    return (
      <Pressable
        onPress={() => note && router.push(`/note/${note.id}`)}
        disabled={!note}
        style={({ pressed }) => [
          styles.cardShell,
          {
            transform: [{ rotate: tilt }, { scale: isActive ? 1 : 0.97 }],
          },
          pressed && styles.cardPressed,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {recording.title}
            </Text>

            <View style={styles.metaRow}>
              {subjectLabel ? (
                <View style={styles.subjectPill}>
                  <Text style={styles.subjectText} numberOfLines={1}>
                    {subjectLabel}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.durationText}>{formatDuration(recording.duration)}</Text>
            </View>

            {chapter ? (
              <View style={styles.insightRow}>
                <AppIcon icon={Bookmark} size={12} color="rgba(255,255,255,0.85)" variant="Outline" />
                <Text style={styles.insightText} numberOfLines={1}>
                  {chapter}
                </Text>
              </View>
            ) : null}

            <Text style={styles.cardSummary} numberOfLines={2}>
              {isProcessing ? t("home.processing") : note?.summary ?? t("home.processing")}
            </Text>

            {topPoint ? (
              <View style={styles.highlightBox}>
                <AppIcon icon={LampOn} size={12} color="#FDE68A" variant="Bold" />
                <Text style={styles.highlightText} numberOfLines={1}>
                  {topPoint}
                </Text>
              </View>
            ) : null}
          </View>

          {note ? (
            <View style={styles.statsRow}>
              <StatChip
                icon={NoteText}
                label={t("home.statKeyPoints", { count: note.keyPoints.length })}
              />
              <StatChip
                icon={Cards}
                label={t("home.statFlashcards", { count: note.flashcards.length })}
              />
            </View>
          ) : null}
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        data={items}
        extraData={activeIndex}
        keyExtractor={(item) =>
          item.kind === "see-all" ? "see-all" : item.recording.id
        }
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
      />

      <View style={styles.dots}>
        {items.map((item, i) => (
          <View
            key={item.kind === "see-all" ? "dot-all" : item.recording.id}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeIndex ? theme.primary : `${theme.primary}30`,
                width: i === activeIndex ? 18 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

function StatChip({ icon, label }: { icon: Icon; label: string }) {
  return (
    <View style={styles.statChip}>
      <AppIcon icon={icon} size={11} color="rgba(255,255,255,0.9)" variant="Outline" />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 4,
  },
  list: {
    height: STAGE_HEIGHT,
    overflow: "visible",
  },
  listContent: {
    paddingRight: HOME_PAD,
  },
  cardShell: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
  },
  cardPressed: { opacity: 0.94 },
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  cardBody: {
    gap: 5,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: fontSize.body,
    fontFamily: fontFamily.bold,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  subjectPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    maxWidth: "68%",
  },
  subjectText: {
    color: "#FFFFFF",
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.semibold,
  },
  durationText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.medium,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  insightText: {
    flex: 1,
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.semibold,
  },
  cardSummary: {
    color: "rgba(255,255,255,0.8)",
    fontSize: fontSize.caption,
    lineHeight: 17,
  },
  highlightBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  highlightText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.medium,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 10,
    fontFamily: fontFamily.semibold,
  },
  seeAllCard: {
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  seeAllIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  seeAllTitle: {
    fontSize: fontSize.body,
    textAlign: "center",
  },
  seeAllSub: {
    fontSize: fontSize.caption,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  seeAllCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 2,
  },
  seeAllCtaText: {
    color: "#FFFFFF",
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
  },
  dots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
