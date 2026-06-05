import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { formatDate } from "../../utils/formatDate";
import { formatDuration } from "../../utils/formatDuration";
import type { Note, Recording } from "../../types";
import { Badge } from "../ui/Badge";

interface NoteCardProps {
  recording: Recording;
  note?: Note;
  subjectLabel?: string;
  onPress: () => void;
  onLongPress?: () => void;
}

export function NoteCard({
  recording,
  note,
  subjectLabel,
  onPress,
  onLongPress,
}: NoteCardProps) {
  const theme = useTheme();
  const preview = note?.summary?.slice(0, 80) ?? "Processing...";

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}
          numberOfLines={1}
        >
          {recording.title}
        </Text>
        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
      </View>
      <Text style={[styles.meta, { color: theme.textSecondary }]}>
        {formatDate(recording.createdAt)} · {formatDuration(recording.duration)}
      </Text>
      {subjectLabel ? <Badge label={subjectLabel} /> : null}
      <Text
        style={[styles.preview, { color: theme.textSecondary, fontFamily: fontFamily.regular }]}
        numberOfLines={2}
      >
        {preview}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: fontSize.body, flex: 1, marginRight: 8 },
  meta: { fontSize: fontSize.tiny },
  preview: { fontSize: fontSize.caption, lineHeight: 20 },
});
