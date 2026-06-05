import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  DocumentUpload,
  FolderOpen,
  MagicStar,
  Microphone2,
  ProfileCircle,
  type Icon,
} from "iconsax-react-nativejs";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Line } from "react-native-svg";
import { BOTTOM_NAV_CLEARANCE } from "../../components/navigation/BottomNav";
import { PendingRecordingSave } from "../../components/recording/PendingRecordingSave";
import { RecordingBanner } from "../../components/recording/RecordingBanner";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { RecentRecordingsCarousel } from "../../components/home/RecentRecordingsCarousel";
import { AppIcon } from "../../components/icons/AppIcon";
import { fontFamily, fontSize } from "../../constants/typography";
import { useAudioUpload } from "../../hooks/useAudioUpload";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useAuthStore } from "../../store/authStore";
import { useNotesStore } from "../../store/notesStore";
import { useRecordingStore } from "../../store/recordingStore";

function PatternOverlay() {
  return (
    <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Line
          key={i}
          x1={i * 20}
          y1="0"
          x2={i * 20 + 40}
          y2="120"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={1}
        />
      ))}
    </Svg>
  );
}

function FeatureCard({
  colors,
  title,
  icon,
  onPress,
  delay,
}: {
  colors: [string, string];
  title: string;
  icon: Icon;
  onPress: () => void;
  delay: number;
}) {
  return (
    <Pressable onPress={onPress} style={styles.featureWrap}>
      <Animated.View entering={FadeInUp.delay(delay).springify()}>
        <LinearGradient
          colors={colors}
          style={styles.featureCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <PatternOverlay />
          <AppIcon icon={icon} size={28} color="#FFFFFF" variant="Outline" />
          <Text style={styles.featureTitle}>{title}</Text>
          <View style={styles.featureArrow}>
            <AppIcon icon={ArrowRight} size={20} color="#FFFFFF" variant="Outline" />
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function getGreetingKey(): "greeting" | "greetingAfternoon" | "greetingEvening" {
  const h = new Date().getHours();
  if (h < 12) return "greeting";
  if (h < 17) return "greetingAfternoon";
  return "greetingEvening";
}

const WAVE_HEIGHTS = [10, 18, 12, 22, 14, 20, 11, 16, 13, 19, 15, 21];

function UploadLectureCard({
  uploading,
  onUpload,
}: {
  uploading: boolean;
  onUpload: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => void onUpload()}
      disabled={uploading}
      style={({ pressed }) => [pressed && !uploading && styles.uploadPress]}
    >
      <LinearGradient
        colors={
          theme.isDark
            ? ["#2A2855", "#1A1A2E"]
            : ["#EEECFF", "#FFFFFF"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.uploadCard, { borderColor: theme.isDark ? "#3D3A6B" : "#E0DEFF" }]}
      >
        <View style={[styles.uploadIconWrap, { backgroundColor: `${theme.primary}22` }]}>
          {uploading ? (
            <ActivityIndicator color={theme.primary} size="small" />
          ) : (
            <AppIcon icon={DocumentUpload} size={22} color={theme.primary} variant="Outline" />
          )}
        </View>
        <View style={styles.uploadCopy}>
          <Text
            style={[styles.uploadTitle, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}
            numberOfLines={1}
          >
            {t("home.uploadTitle")}
          </Text>
          <Text style={[styles.uploadSub, { color: theme.textSecondary }]} numberOfLines={1}>
            {uploading ? t("home.uploading") : t("home.uploadSub")}
          </Text>
        </View>
        <View style={[styles.uploadCtaPill, { backgroundColor: theme.primary }]}>
          <Text style={styles.uploadCtaText}>{uploading ? "…" : t("home.uploadCta")}</Text>
          {!uploading && <AppIcon icon={ArrowRight} size={14} color="#FFFFFF" variant="Outline" />}
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function RecordingsEmptyState({
  onRecord,
  onUpload,
}: {
  onRecord: () => void;
  onUpload: () => void;
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.emptyCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.textPrimary,
        },
      ]}
    >
      <View style={styles.emptyWaveRow} pointerEvents="none">
        {WAVE_HEIGHTS.map((h, i) => (
          <View
            key={i}
            style={[
              styles.emptyWaveBar,
              {
                height: h,
                backgroundColor: `${theme.primary}${i % 2 === 0 ? "28" : "18"}`,
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.emptyGlow, { backgroundColor: `${theme.primary}18` }]}>
        <View
          style={[
            styles.emptyIconRing,
            { borderColor: `${theme.primary}35`, backgroundColor: theme.surface },
          ]}
        >
          <AppIcon icon={Microphone2} size={28} color={theme.primary} variant="Outline" />
        </View>
      </View>

      <Text
        style={[styles.emptyTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
      >
        {t("home.emptyTitle")}
      </Text>
      <Text style={[styles.emptySub, { color: theme.textSecondary }]}>{t("home.emptySub")}</Text>

      <View style={styles.emptyActions}>
        <Pressable
          onPress={onRecord}
          style={[styles.emptyActionPrimary, { backgroundColor: theme.primary }]}
        >
          <AppIcon icon={Microphone2} size={16} color="#FFFFFF" variant="Bold" />
          <Text style={styles.emptyActionPrimaryText}>{t("home.emptyRecord")}</Text>
        </Pressable>
        <Pressable
          onPress={() => void onUpload()}
          style={[
            styles.emptyActionSecondary,
            { backgroundColor: theme.isDark ? "#2D2D44" : "#F0EEFF", borderColor: theme.border },
          ]}
        >
          <AppIcon icon={DocumentUpload} size={16} color={theme.primary} variant="Outline" />
          <Text style={[styles.emptyActionSecondaryText, { color: theme.primary }]}>
            {t("home.emptyUpload")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const recordings = useRecordingStore((s) => s.recordings);
  const getNote = useNotesStore((s) => s.getNoteByRecordingId);
  const folders = useNotesStore((s) => s.folders);

  const { uploading, pickAndProcess } = useAudioUpload();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const insets = useSafeAreaInsets();

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
        edges={["left", "right", "bottom"]}
      >
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
          <Text style={[styles.greeting, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
            {t(`home.${getGreetingKey()}`)}, {firstName} 👋
          </Text>
          <Pressable
            onPress={() => router.push("/profile")}
            style={[styles.profileBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
            ) : (
              <AppIcon icon={ProfileCircle} size={22} color={theme.primary} variant="Outline" />
            )}
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: BOTTOM_NAV_CLEARANCE + Math.max(insets.bottom, 8) + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <RecordingBanner />
          <View style={styles.features}>
            <FeatureCard
              colors={["#6C63FF", "#A78BFA"]}
              title={t("home.myNotes")}
              icon={FolderOpen}
              onPress={() => router.push("/(tabs)/library")}
              delay={80}
            />
            <FeatureCard
              colors={["#1A1A2E", "#2D2D44"]}
              title={t("home.askAI")}
              icon={MagicStar}
              onPress={() => router.push("/(tabs)/library")}
              delay={140}
            />
          </View>

          <Animated.View entering={FadeInUp.delay(200).springify()}>
            <UploadLectureCard uploading={uploading} onUpload={pickAndProcess} />
          </Animated.View>

          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary, fontFamily: fontFamily.semibold },
            ]}
          >
            {t("home.recentRecordings")}
          </Text>

          {recordings.length === 0 ? (
            <Animated.View entering={FadeInUp.delay(280).springify()}>
              <RecordingsEmptyState
                onRecord={() => router.push("/recording")}
                onUpload={pickAndProcess}
              />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.delay(260).springify()}>
              <RecentRecordingsCarousel
                recordings={recordings}
                getNote={getNote}
                getSubjectLabel={(folderId) =>
                  folders.find((f) => f.id === folderId)?.name
                }
              />
            </Animated.View>
          )}
        </ScrollView>
        <PendingRecordingSave />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: { fontSize: fontSize.title, flex: 1, marginRight: 12 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileAvatar: { width: 44, height: 44 },
  features: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  featureWrap: { flex: 1 },
  featureCard: {
    borderRadius: 20,
    padding: 18,
    minHeight: 128,
    overflow: "hidden",
    justifyContent: "space-between",
  },
  featureTitle: {
    color: "#FFFFFF",
    fontSize: fontSize.subtitle,
    fontFamily: fontFamily.bold,
    marginTop: 12,
  },
  featureArrow: { alignSelf: "flex-end" },
  uploadPress: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 22,
    gap: 12,
    overflow: "hidden",
  },
  uploadIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadCopy: { flex: 1, gap: 2, minWidth: 0 },
  uploadTitle: { fontSize: fontSize.body },
  uploadSub: { fontSize: fontSize.tiny, lineHeight: 16 },
  uploadCtaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  uploadCtaText: {
    color: "#FFFFFF",
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
  },
  sectionTitle: { fontSize: fontSize.subtitle, marginBottom: 14 },
  emptyCard: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 22,
    paddingHorizontal: 20,
    borderRadius: 22,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  emptyWaveRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
    height: 28,
    marginBottom: 14,
    opacity: 0.9,
  },
  emptyWaveBar: {
    width: 4,
    borderRadius: 2,
  },
  emptyGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: fontSize.subtitle, marginBottom: 6 },
  emptySub: {
    fontSize: fontSize.caption,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 18,
  },
  emptyActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  emptyActionPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
  },
  emptyActionPrimaryText: {
    color: "#FFFFFF",
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
  },
  emptyActionSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyActionSecondaryText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
  },
});
