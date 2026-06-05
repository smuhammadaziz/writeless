import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { formatDuration } from "../../utils/formatDuration";
import type { Chapter } from "../../types";

interface ChapterItemProps {
  chapter: Chapter;
  onPress: () => void;
}

export function ChapterItem({ chapter, onPress }: ChapterItemProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, { borderBottomColor: theme.border }]}
    >
      <View style={[styles.time, { backgroundColor: `${theme.primary}18` }]}>
        <Text style={[styles.timeText, { color: theme.primary, fontFamily: fontFamily.semibold }]}>
          {formatDuration(chapter.start)}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.headline, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}>
          {chapter.headline}
        </Text>
        <Text style={[styles.summary, { color: theme.textSecondary }]} numberOfLines={2}>
          {chapter.summary}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  time: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  timeText: { fontSize: fontSize.tiny },
  content: { flex: 1 },
  headline: { fontSize: fontSize.body, marginBottom: 4 },
  summary: { fontSize: fontSize.caption, lineHeight: 20 },
});
