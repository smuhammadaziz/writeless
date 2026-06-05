import type { Icon } from "iconsax-react-nativejs";
import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "../icons/AppIcon";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";

interface NoteSectionHeaderProps {
  icon: Icon;
  title: string;
  subtitle?: string;
}

export function NoteSectionHeader({ icon, title, subtitle }: NoteSectionHeaderProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.iconRing, { backgroundColor: `${theme.primary}14`, borderColor: `${theme.primary}28` }]}>
        <AppIcon icon={icon} size={18} color={theme.primary} variant="Outline" />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  iconRing: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.subtitle },
  subtitle: { fontSize: fontSize.tiny },
});
