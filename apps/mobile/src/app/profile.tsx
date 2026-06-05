import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageModal } from "../components/modals/LanguageModal";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { fontFamily, fontSize } from "../constants/typography";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../hooks/useTranslation";
import { useNotesStore } from "../store/notesStore";
import { useRecordingStore } from "../store/recordingStore";
import { useSettingsStore } from "../store/settingsStore";
import type { AppLanguage, ThemePreference } from "../types";

export default function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user, signOut, deleteAccount } = useAuth();
  const recordings = useRecordingStore((s) => s.recordings);
  const language = useSettingsStore((s) => s.language);
  const themePref = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotifications = useSettingsStore((s) => s.setNotifications);
  const [langModal, setLangModal] = useState(false);

  const totalSeconds = recordings.reduce((a, r) => a + r.duration, 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const folderCount = useNotesStore((s) => s.folders.length);

  const cycleTheme = async () => {
    const order: ThemePreference[] = ["light", "dark", "system"];
    const next = order[(order.indexOf(themePref) + 1) % order.length];
    await setTheme(next);
  };

  const themeLabel =
    themePref === "light"
      ? t("profile.themeLight")
      : themePref === "dark"
        ? t("profile.themeDark")
        : t("profile.themeSystem");

  const handleSignOut = () => {
    Alert.alert(t("profile.signOut"), t("profile.signOutConfirm"), [
      { text: t("profile.cancel"), style: "cancel" },
      {
        text: t("profile.signOut"),
        style: "destructive",
        onPress: () => {
          void signOut().then(() => router.replace("/login"));
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t("profile.deleteAccount"), t("profile.deleteAccountConfirm"), [
      { text: t("profile.cancel"), style: "cancel" },
      {
        text: t("profile.deleteAccount"),
        style: "destructive",
        onPress: () => {
          void deleteAccount().then(() => router.replace("/login"));
        },
      },
    ]);
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </Pressable>
          <Text style={[styles.screenTitle, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
            {t("profile.title")}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.heroCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.avatarText}>{user?.name?.[0] ?? "?"}</Text>
              </View>
            )}
            <Text style={[styles.name, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
              {user?.name ?? "—"}
            </Text>
            <Text style={{ color: theme.textSecondary, fontSize: fontSize.caption }}>{user?.email}</Text>

            <View style={styles.statsRow}>
              <StatPill label={t("profile.recordings")} value={String(recordings.length)} theme={theme} />
              <StatPill label={t("profile.hours")} value={totalHours} theme={theme} />
              <StatPill label={t("profile.subjects")} value={String(folderCount)} theme={theme} />
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            {t("profile.settings")}
          </Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingsRow
              icon="language-outline"
              label={t("profile.language")}
              value={language.toUpperCase()}
              onPress={() => setLangModal(true)}
              theme={theme}
            />
            <SettingsRow
              icon="moon-outline"
              label={t("profile.theme")}
              value={themeLabel}
              onPress={() => void cycleTheme()}
              theme={theme}
            />
            <View style={[styles.row, styles.rowLast]}>
              <Ionicons name="notifications-outline" size={22} color={theme.primary} />
              <Text style={[styles.rowLabel, { color: theme.textPrimary, fontFamily: fontFamily.medium }]}>
                {t("profile.notifications")}
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotifications}
                trackColor={{ true: theme.primary }}
              />
            </View>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <SettingsRow
              icon="information-circle-outline"
              label={t("profile.version")}
              value="1.0.0"
              theme={theme}
              isLast
            />
          </View>

          <View style={[styles.dangerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Pressable onPress={handleSignOut} style={styles.dangerRow}>
              <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              <Text style={[styles.dangerText, { fontFamily: fontFamily.semibold }]}>
                {t("profile.signOut")}
              </Text>
            </Pressable>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <Pressable onPress={handleDeleteAccount} style={styles.dangerRow}>
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
              <Text style={[styles.dangerText, { fontFamily: fontFamily.semibold }]}>
                {t("profile.deleteAccount")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <LanguageModal
          visible={langModal}
          current={language}
          onClose={() => setLangModal(false)}
          onSelect={(lang: AppLanguage) => {
            void setLanguage(lang);
            setLangModal(false);
          }}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

function StatPill({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ReturnType<typeof useTheme>;
}) {
  return (
    <View style={[styles.statPill, { backgroundColor: `${theme.primary}12` }]}>
      <Text style={[styles.statValue, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
        {value}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: fontSize.tiny }}>{label}</Text>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  theme,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
  theme: ReturnType<typeof useTheme>;
  isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, isLast && styles.rowLast]}
    >
      <Ionicons name={icon} size={22} color={theme.primary} />
      <Text style={[styles.rowLabel, { color: theme.textPrimary, fontFamily: fontFamily.medium }]}>
        {label}
      </Text>
      <Text style={{ color: theme.textSecondary, fontSize: fontSize.caption }}>{value}</Text>
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  screenTitle: { fontSize: fontSize.subtitle },
  scroll: { padding: 20, paddingBottom: 40 },
  heroCard: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 24,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  avatarText: { color: "#FFF", fontSize: 32, textAlign: "center", lineHeight: 80 },
  name: { fontSize: fontSize.title, marginBottom: 4 },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    width: "100%",
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  statValue: { fontSize: fontSize.subtitle, marginBottom: 2 },
  sectionLabel: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.semibold,
    marginBottom: 10,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  settingsCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { flex: 1, fontSize: fontSize.body },
  dangerCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    overflow: "hidden",
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  dangerText: { color: "#EF4444", fontSize: fontSize.body },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
});
