import { LinearGradient } from "expo-linear-gradient";
import { ArrowCircleRight } from "iconsax-react-nativejs";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useRecordingStore } from "../../store/recordingStore";
import { formatDuration } from "../../utils/formatDuration";
import { AppIcon } from "../icons/AppIcon";
import { LiveWaveform } from "./LiveWaveform";

export function RecordingBanner() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const isRecording = useRecordingStore((s) => s.flowStatus === "recording");
  const elapsed = useRecordingStore((s) => s.elapsedSeconds);

  if (!isRecording) return null;

  return (
    <Pressable
      onPress={() => router.push("/recording/active")}
      style={({ pressed }) => [styles.wrap, pressed && { opacity: 0.94 }]}
    >
      <LinearGradient
        colors={["#6C63FF", "#8B83FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.liveRow}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{t("recording.bannerLive")}</Text>
          <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
        </View>
        <View style={styles.waveWrap}>
          <LiveWaveform variant="light" />
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t("recording.bannerTap")}</Text>
          <AppIcon icon={ArrowCircleRight} size={28} color="#FFFFFF" variant="Outline" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  card: {
    borderRadius: 18,
    padding: 14,
    overflow: "hidden",
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FCA5A5",
  },
  liveText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.caption,
    flex: 1,
  },
  timer: {
    color: "#FFFFFF",
    fontFamily: fontFamily.bold,
    fontSize: fontSize.subtitle,
  },
  waveWrap: {
    marginVertical: 4,
    opacity: 0.95,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  footerText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.medium,
  },
});
