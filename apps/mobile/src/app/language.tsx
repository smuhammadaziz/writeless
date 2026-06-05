import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppLogo } from "../components/ui/AppLogo";
import { PrimaryArrowButton } from "../components/ui/PrimaryArrowButton";
import { lightColors } from "../constants/colors";
import { fontFamily, fontSize } from "../constants/typography";
import { useTranslation } from "../hooks/useTranslation";
import { useSettingsStore } from "../store/settingsStore";
import type { AppLanguage } from "../types";
import i18n from "../i18n";

const LANGUAGES: Array<{
  code: AppLanguage;
  nativeName: string;
  englishName: string;
  flag: string;
}> = [
  { code: "en", nativeName: "English", englishName: "English", flag: "🇬🇧" },
  { code: "uz", nativeName: "O'zbek", englishName: "Uzbek", flag: "🇺🇿" },
  { code: "ru", nativeName: "Русский", englishName: "Russian", flag: "🇷🇺" },
];

function LanguageCard({
  selected,
  onPress,
  flag,
  nativeName,
  englishName,
}: {
  selected: boolean;
  onPress: () => void;
  flag: string;
  nativeName: string;
  englishName: string;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={anim}>
      <Pressable
        onPress={() => {
          scale.value = withSpring(0.98, {}, () => {
            scale.value = withSpring(1);
          });
          void Haptics.selectionAsync();
          onPress();
        }}
        style={[
          styles.card,
          selected ? styles.cardSelected : styles.cardDefault,
        ]}
      >
        <Text style={styles.flag}>{flag}</Text>
        <View style={styles.cardText}>
          <Text
            style={[
              styles.nativeName,
              {
                fontFamily: fontFamily.semibold,
                color: selected ? "#FFFFFF" : lightColors.textPrimary,
              },
            ]}
          >
            {nativeName}
          </Text>
          <Text
            style={{
              fontSize: fontSize.caption,
              color: selected ? "rgba(255,255,255,0.85)" : lightColors.textSecondary,
            }}
          >
            {englishName}
          </Text>
        </View>
        {selected ? (
          <View style={styles.check}>
            <Ionicons name="checkmark" size={18} color={lightColors.primary} />
          </View>
        ) : (
          <View style={styles.radioEmpty} />
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const setLanguageChosen = useSettingsStore((s) => s.setLanguageChosen);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const storedLanguage = useSettingsStore((s) => s.language);
  const languageChosen = useSettingsStore((s) => s.languageChosen);
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  const [selected, setSelected] = useState<AppLanguage>(storedLanguage);

  useEffect(() => {
    if (!languageChosen) return;
    if (!onboardingDone) {
      router.replace("/onboarding");
      return;
    }
    router.replace("/login");
  }, [languageChosen, onboardingDone, router]);

  const previewLanguage = useCallback(async (code: AppLanguage) => {
    setSelected(code);
    await i18n.changeLanguage(code);
  }, []);

  const continueFlow = async () => {
    await setLanguage(selected);
    await setTheme("light");
    await setLanguageChosen(true);
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.brandRow}>
          <AppLogo size={40} color={lightColors.primary} />
          <Text style={[styles.brandName, { fontFamily: fontFamily.bold }]}>Writeless</Text>
        </View>

        <Text style={[styles.title, { fontFamily: fontFamily.bold }]}>{t("language.title")}</Text>
        <Text style={[styles.subtitle, { fontFamily: fontFamily.regular }]}>
          {t("language.subtitle")}
        </Text>

        <View style={styles.cards}>
          {LANGUAGES.map((lang) => (
            <LanguageCard
              key={lang.code}
              flag={lang.flag}
              nativeName={lang.nativeName}
              englishName={lang.englishName}
              selected={selected === lang.code}
              onPress={() => void previewLanguage(lang.code)}
            />
          ))}
        </View>

        <Text style={styles.hint}>{t("language.hint")}</Text>
      </View>

      <View style={styles.footer}>
        <PrimaryArrowButton label={t("language.continue")} onPress={() => void continueFlow()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  brandName: {
    fontSize: fontSize.subtitle,
    color: lightColors.textPrimary,
  },
  title: {
    fontSize: 28,
    color: lightColors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: fontSize.body,
    color: lightColors.textSecondary,
    lineHeight: 24,
    marginBottom: 28,
  },
  cards: { gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    gap: 14,
  },
  cardDefault: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: lightColors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardSelected: {
    backgroundColor: lightColors.primary,
    borderWidth: 0,
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  flag: { fontSize: 32 },
  cardText: { flex: 1 },
  nativeName: { fontSize: fontSize.body },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  hint: {
    marginTop: 20,
    textAlign: "center",
    fontSize: fontSize.caption,
    color: lightColors.textSecondary,
    fontFamily: fontFamily.regular,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
});
