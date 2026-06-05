import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";

interface KeywordBadgeProps {
  keyword: string;
}

export function KeywordBadge({ keyword }: KeywordBadgeProps) {
  const theme = useTheme();
  return (
    <View style={[styles.pill, { backgroundColor: `${theme.accent}33`, borderColor: theme.accent }]}>
      <Text style={[styles.text, { color: theme.primary, fontFamily: fontFamily.medium }]}>
        {keyword}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  text: { fontSize: fontSize.caption },
});
