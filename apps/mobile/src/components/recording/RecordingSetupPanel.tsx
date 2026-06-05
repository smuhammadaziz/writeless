import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MAX_RECORDING_MINUTES } from "../../constants/config";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import type { RecordingLanguage } from "../../types";
import { LanguageSelect } from "./LanguageSelect";
import { RecordButton } from "./RecordButton";
import { WaveformVisualizer } from "./WaveformVisualizer";

const LANGS: Array<{
  code: RecordingLanguage;
  labelKey: "recording.langEn" | "recording.langUz" | "recording.langRu";
}> = [
  { code: "en", labelKey: "recording.langEn" },
  { code: "uz", labelKey: "recording.langUz" },
  { code: "ru", labelKey: "recording.langRu" },
];

export function RecordingSetupPanel({
  currentLanguage,
  onSelectLanguage,
  onStart,
}: {
  currentLanguage: RecordingLanguage;
  onSelectLanguage: (lang: RecordingLanguage) => void;
  onStart: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();
  const selectedLang = LANGS.find((l) => l.code === currentLanguage)!;

  return (
    <ScrollView contentContainerStyle={styles.idleScroll} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={theme.isDark ? ["#2A2855", "#1A1A2E"] : ["#EEECFF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroCard, { borderColor: theme.isDark ? "#3D3A6B" : "#E0DEFF" }]}
      >
        <View style={[styles.stepLangBlock, { backgroundColor: `${theme.primary}0C` }]}>
          <View style={styles.stepRow}>
            <View style={[styles.stepBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.stepBadgeText}>1</Text>
            </View>
            <Text
              style={[styles.stepTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
            >
              {t("recording.stepLanguage")}
            </Text>
          </View>
          <LanguageSelect value={currentLanguage} onChange={onSelectLanguage} />
        </View>

        <View style={styles.stepDivider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.stepRow}>
          <View style={[styles.stepBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <Text
            style={[styles.stepTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
          >
            {t("recording.stepRecord")}
          </Text>
        </View>

        <WaveformVisualizer active variant="hero" />
        <RecordButton onPress={onStart} size={88} pulsing />

        <View style={[styles.selectedLangBanner, { backgroundColor: `${theme.primary}16` }]}>
          <Ionicons name="document-text-outline" size={16} color={theme.primary} />
          <Text style={[styles.selectedLangText, { color: theme.primary }]}>
            {t("recording.recordingIn", { lang: t(selectedLang.labelKey) })}
          </Text>
        </View>

        <Text
          style={[styles.tapLabel, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}
        >
          {t("recording.tapToStart")}
        </Text>
        <View style={[styles.durationChip, { backgroundColor: `${theme.primary}14` }]}>
          <Ionicons name="time-outline" size={14} color={theme.primary} />
          <Text style={[styles.durationText, { color: theme.primary }]}>
            {t("recording.maxDuration", { minutes: MAX_RECORDING_MINUTES })}
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  idleScroll: { paddingHorizontal: 20, paddingBottom: 28 },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 18,
    overflow: "hidden",
    width: "100%",
  },
  stepLangBlock: { width: "100%", borderRadius: 16, padding: 14, gap: 10 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: { color: "#FFFFFF", fontSize: fontSize.tiny, fontFamily: fontFamily.bold },
  stepTitle: { fontSize: fontSize.body, flex: 1 },
  stepDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    marginVertical: 14,
  },
  dividerLine: { flex: 1, height: 1 },
  selectedLangBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    width: "100%",
  },
  selectedLangText: { flex: 1, fontSize: fontSize.caption, fontFamily: fontFamily.semibold },
  tapLabel: { fontSize: fontSize.body, marginTop: 12, textAlign: "center" },
  durationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  durationText: { fontSize: fontSize.tiny, fontFamily: fontFamily.medium },
});
