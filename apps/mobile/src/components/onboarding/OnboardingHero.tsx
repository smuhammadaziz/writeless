import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { lightColors } from "../../constants/colors";
import { fontFamily, fontSize } from "../../constants/typography";
import { OnboardingIllustration } from "./OnboardingIllustrations";

interface FloatingBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  style: object;
  iconColor: string;
  iconBg: string;
}

function FloatingBadge({
  icon,
  title,
  subtitle,
  style,
  iconColor,
  iconBg,
}: FloatingBadgeProps) {
  return (
    <View style={[styles.badge, style]}>
      <View style={[styles.badgeIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View>
        <Text style={[styles.badgeTitle, { fontFamily: fontFamily.bold }]}>{title}</Text>
        <Text style={styles.badgeSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

interface OnboardingHeroProps {
  step: 1 | 2;
  badge1Title: string;
  badge1Sub: string;
  badge2Title: string;
  badge2Sub: string;
}

export function OnboardingHero({
  step,
  badge1Title,
  badge1Sub,
  badge2Title,
  badge2Sub,
}: OnboardingHeroProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["#E8E6FF", "#F5F5FF", "#FFFFFF"]}
        style={styles.glow}
      />
      <View style={styles.ringOuter}>
        <LinearGradient
          colors={["#6C63FF", "#A78BFA", "#6C63FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ringGradient}
        >
          <View style={styles.ringInner}>
            <OnboardingIllustration step={step} width={200} height={160} />
          </View>
        </LinearGradient>
      </View>
      <FloatingBadge
        icon={step === 1 ? "time-outline" : "list-outline"}
        title={badge1Title}
        subtitle={badge1Sub}
        iconColor="#6C63FF"
        iconBg="#EEEDFF"
        style={styles.badgeTopLeft}
      />
      <FloatingBadge
        icon={step === 1 ? "sparkles" : "school-outline"}
        title={badge2Title}
        subtitle={badge2Sub}
        iconColor="#10B981"
        iconBg="#D1FAE5"
        style={styles.badgeBottomRight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 300,
    height: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.9,
  },
  ringOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: "hidden",
  },
  ringGradient: {
    flex: 1,
    padding: 4,
    borderRadius: 110,
  },
  ringInner: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 106,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    shadowColor: lightColors.textPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  badgeTopLeft: { top: 24, left: 0 },
  badgeBottomRight: { bottom: 32, right: 0 },
  badgeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeTitle: {
    fontSize: fontSize.caption,
    color: lightColors.textPrimary,
  },
  badgeSub: {
    fontSize: fontSize.tiny,
    color: lightColors.textSecondary,
  },
});
