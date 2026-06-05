import { DocumentText } from "iconsax-react-nativejs";
import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { AppIcon } from "../icons/AppIcon";
import { Card } from "../ui/Card";

interface SummaryCardProps {
  summary: string;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: `${theme.primary}14` }]}>
          <AppIcon icon={DocumentText} size={18} color={theme.primary} variant="Outline" />
        </View>
        <Text style={[styles.label, { color: theme.primary, fontFamily: fontFamily.semibold }]}>
          {t("note.overview")}
        </Text>
      </View>
      <Text style={[styles.text, { color: theme.textPrimary, fontFamily: fontFamily.regular }]}>
        {summary}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: fontSize.caption,
  },
  text: {
    fontSize: fontSize.body,
    lineHeight: 26,
  },
});
