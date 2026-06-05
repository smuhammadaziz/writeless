import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import type { RecordingLanguage } from "../../types";

const OPTIONS: Array<{
  code: RecordingLanguage;
  flag: string;
  labelKey: "recording.langEn" | "recording.langUz" | "recording.langRu";
}> = [
  { code: "en", flag: "🇬🇧", labelKey: "recording.langEn" },
  { code: "uz", flag: "🇺🇿", labelKey: "recording.langUz" },
  { code: "ru", flag: "🇷🇺", labelKey: "recording.langRu" },
];

interface LanguageSelectProps {
  value: RecordingLanguage;
  onChange: (lang: RecordingLanguage) => void;
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const selected = OPTIONS.find((o) => o.code === value)!;

  const pick = (code: RecordingLanguage) => {
    void Haptics.selectionAsync();
    onChange(code);
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            shadowColor: theme.textPrimary,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("recording.transcriptionLang")}
      >
        <View style={[styles.flagCircle, { backgroundColor: `${theme.primary}12` }]}>
          <Text style={styles.flagLarge}>{selected.flag}</Text>
        </View>
        <View style={styles.triggerCopy}>
          <Text style={[styles.triggerLabel, { color: theme.textSecondary }]}>
            {t("recording.transcriptionLang")}
          </Text>
          <Text
            style={[
              styles.triggerValue,
              { color: theme.textPrimary, fontFamily: fontFamily.semibold },
            ]}
          >
            {t(selected.labelKey)}
          </Text>
        </View>
        <View style={[styles.chevronWrap, { backgroundColor: `${theme.primary}14` }]}>
          <Ionicons name="chevron-down" size={18} color={theme.primary} />
        </View>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheetPressable}>
            <Animated.View
              entering={FadeInDown.springify().damping(18)}
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
              <Text
                style={[
                  styles.sheetTitle,
                  { color: theme.textPrimary, fontFamily: fontFamily.bold },
                ]}
              >
                {t("recording.transcriptionLang")}
              </Text>
              <Text style={[styles.sheetSub, { color: theme.textSecondary }]}>
                {t("recording.langHint")}
              </Text>

              <View style={styles.options}>
                {OPTIONS.map((opt, i) => {
                  const isSelected = value === opt.code;
                  return (
                    <Animated.View key={opt.code} entering={FadeIn.delay(80 + i * 50)}>
                      <Pressable
                        onPress={() => pick(opt.code)}
                        style={[
                          styles.option,
                          {
                            backgroundColor: isSelected ? `${theme.primary}10` : theme.background,
                            borderColor: isSelected ? theme.primary : theme.border,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.optionFlag,
                            { backgroundColor: isSelected ? `${theme.primary}18` : `${theme.border}55` },
                          ]}
                        >
                          <Text style={styles.optionFlagText}>{opt.flag}</Text>
                        </View>
                        <Text
                          style={[
                            styles.optionLabel,
                            {
                              color: theme.textPrimary,
                              fontFamily: isSelected ? fontFamily.bold : fontFamily.medium,
                            },
                          ]}
                        >
                          {t(opt.labelKey)}
                        </Text>
                        <View
                          style={[
                            styles.radio,
                            {
                              borderColor: isSelected ? theme.primary : theme.border,
                              backgroundColor: isSelected ? theme.primary : "transparent",
                            },
                          ]}
                        >
                          {isSelected ? (
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          ) : null}
                        </View>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>

              <Pressable
                onPress={() => setOpen(false)}
                style={[styles.doneBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.doneBtnText}>{t("recording.langDone")}</Text>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  flagCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  flagLarge: { fontSize: 26 },
  triggerCopy: { flex: 1, gap: 2 },
  triggerLabel: { fontSize: fontSize.tiny, fontFamily: fontFamily.medium },
  triggerValue: { fontSize: fontSize.body },
  chevronWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 15, 26, 0.5)",
    justifyContent: "flex-end",
  },
  sheetPressable: { width: "100%" },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: fontSize.subtitle, marginBottom: 6 },
  sheetSub: { fontSize: fontSize.caption, lineHeight: 20, marginBottom: 18 },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  optionFlag: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  optionFlagText: { fontSize: 24 },
  optionLabel: { flex: 1, fontSize: fontSize.body },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtn: {
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: fontSize.body,
    fontFamily: fontFamily.semibold,
  },
});
