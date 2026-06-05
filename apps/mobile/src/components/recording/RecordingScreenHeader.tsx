import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";

export function RecordingScreenHeader({
  onClose,
  title,
  subtitle,
}: {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
      <Pressable
        onPress={onClose}
        style={[
          styles.closeBtn,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.textPrimary,
          },
        ]}
      >
        <Ionicons name="close" size={22} color={theme.textPrimary} />
      </Pressable>
      {title ? (
        <View style={styles.headerTitles}>
          <Text
            style={[styles.headerTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.headerSub, { color: theme.textSecondary }]} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.headerSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitles: { flex: 1, paddingTop: 4, gap: 4 },
  headerTitle: { fontSize: fontSize.title },
  headerSub: { fontSize: fontSize.caption, lineHeight: 20 },
  headerSpacer: { flex: 1 },
});
