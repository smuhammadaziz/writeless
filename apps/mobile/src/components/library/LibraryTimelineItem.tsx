import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import type { Note, Recording } from "../../types";
import { formatDuration } from "../../utils/formatDuration";

interface LibraryTimelineItemProps {
  recording: Recording;
  note?: Note;
  subjectLabel?: string;
  accentColor?: string;
  isFirst?: boolean;
  isLast?: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

export function LibraryTimelineItem({
  recording,
  note,
  subjectLabel,
  accentColor = "#6C63FF",
  isFirst = false,
  isLast = false,
  onPress,
  onLongPress,
}: LibraryTimelineItemProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isProcessing =
    recording.status === "processing" || recording.status === "uploading";
  const canOpen = Boolean(note) && !isProcessing;

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.node,
            {
              backgroundColor: canOpen ? accentColor : theme.border,
              borderColor: canOpen ? accentColor : theme.border,
            },
          ]}
        >
          <Ionicons
            name={canOpen ? "document-text" : "hourglass-outline"}
            size={16}
            color={canOpen ? "#FFFFFF" : theme.textSecondary}
          />
        </View>
        {!isLast ? (
          <View style={[styles.line, { backgroundColor: theme.border }]} />
        ) : null}
      </View>

      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={!canOpen}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.textPrimary,
            opacity: pressed && canOpen ? 0.96 : 1,
          },
        ]}
      >
        <View style={styles.cardTop}>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary, fontFamily: fontFamily.bold },
            ]}
            numberOfLines={2}
          >
            {recording.title}
          </Text>
          {isFirst ? (
            <View style={[styles.badge, { backgroundColor: `${accentColor}18` }]}>
              <Text style={[styles.badgeText, { color: accentColor }]}>
                {t("library.latest")}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.summary, { color: theme.textSecondary }]} numberOfLines={2}>
          {isProcessing
            ? t("home.processing")
            : note?.summary ?? t("home.processing")}
        </Text>

        <View style={styles.metaRow}>
          {subjectLabel ? (
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {subjectLabel}
            </Text>
          ) : null}
          {note ? (
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {t("home.statKeyPoints", { count: note.keyPoints.length })}
            </Text>
          ) : null}
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatDuration(recording.duration)}
          </Text>
        </View>

        {canOpen ? (
          <Pressable
            onPress={onPress}
            style={[styles.openBtn, { backgroundColor: accentColor }]}
          >
            <Text style={styles.openBtnText}>{t("library.openNote")}</Text>
          </Pressable>
        ) : (
          <View style={[styles.lockedBtn, { backgroundColor: `${theme.border}88` }]}>
            <Text style={[styles.lockedText, { color: theme.textSecondary }]}>
              {t("library.processing")}
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 4,
  },
  rail: {
    width: 32,
    alignItems: "center",
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
    marginTop: 4,
    borderRadius: 1,
  },
  card: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: fontSize.body,
    lineHeight: 22,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.semibold,
  },
  summary: {
    fontSize: fontSize.caption,
    lineHeight: 20,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  metaText: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.medium,
  },
  openBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  openBtnText: {
    color: "#FFFFFF",
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
  },
  lockedBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  lockedText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
  },
});
