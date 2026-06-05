import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { DEFAULT_FOLDER_ICON, FOLDER_ICON_OPTIONS } from "../../constants/folderIcons";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import type { FolderIconId } from "../../types";
import { FolderIcon } from "../icons/FolderIcon";
import { Button } from "../ui/Button";

interface FolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string, icon: FolderIconId) => void;
}

const FOLDER_COLORS = ["#6C63FF", "#A78BFA", "#1A1A2E", "#10B981", "#F59E0B"];

export function FolderModal({ visible, onClose, onCreate }: FolderModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [color, setColor] = useState(FOLDER_COLORS[0]);
  const [icon, setIcon] = useState<FolderIconId>(DEFAULT_FOLDER_ICON);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), color, icon);
    setName("");
    setIcon(DEFAULT_FOLDER_ICON);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.surface }]}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
            {t("library.newFolder")}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t("library.folderNamePlaceholder")}
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.textPrimary,
                borderColor: theme.border,
                backgroundColor: theme.background,
                fontFamily: fontFamily.regular,
              },
            ]}
          />
          <View style={styles.iconRow}>
            {FOLDER_ICON_OPTIONS.map((iconId) => {
              const selected = icon === iconId;
              return (
                <Pressable
                  key={iconId}
                  onPress={() => setIcon(iconId)}
                  style={[
                    styles.iconBtn,
                    {
                      borderColor: selected ? theme.primary : theme.border,
                      backgroundColor: selected ? `${theme.primary}12` : theme.background,
                    },
                  ]}
                >
                  <FolderIcon
                    icon={iconId}
                    size={20}
                    color={selected ? theme.primary : theme.textSecondary}
                    variant={selected ? "Bold" : "Linear"}
                  />
                </Pressable>
              );
            })}
          </View>
          <View style={styles.colorRow}>
            {FOLDER_COLORS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColor(c)}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: c,
                    borderWidth: color === c ? 3 : 0,
                    borderColor: theme.textPrimary,
                  },
                ]}
              />
            ))}
          </View>
          <Button label={t("library.createFolder")} onPress={handleCreate} fullWidth />
        </Pressable>
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
    gap: 16,
  },
  title: { fontSize: fontSize.title },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: fontSize.body,
  },
  iconRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  colorRow: { flexDirection: "row", gap: 12 },
  colorDot: { width: 32, height: 32, borderRadius: 16 },
});
