import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import type { AppLanguage } from "../../types";

const OPTIONS: Array<{ code: AppLanguage; label: string; flag: string }> = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

interface LanguageModalProps {
  visible: boolean;
  current: AppLanguage;
  onSelect: (lang: AppLanguage) => void;
  onClose: () => void;
}

export function LanguageModal({
  visible,
  current,
  onSelect,
  onClose,
}: LanguageModalProps) {
  const theme = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          {OPTIONS.map((opt) => (
            <Pressable
              key={opt.code}
              onPress={() => onSelect(opt.code)}
              style={[
                styles.option,
                {
                  backgroundColor:
                    current === opt.code ? theme.primary : theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={styles.flag}>{opt.flag}</Text>
              <Text
                style={{
                  color: current === opt.code ? "#FFF" : theme.textPrimary,
                  fontFamily: fontFamily.semibold,
                  fontSize: fontSize.body,
                }}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  flag: { fontSize: 24 },
});
