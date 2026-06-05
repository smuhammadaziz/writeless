import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotesStore } from "../../store/notesStore";
import { FolderIcon } from "../icons/FolderIcon";
import { FolderModal } from "./FolderModal";
import { Button } from "../ui/Button";

interface SaveRecordingModalProps {
  visible: boolean;
  initialTitle: string;
  lessonHint?: string;
  onSave: (title: string, folderId?: string) => void;
  onClose: () => void;
}

export function SaveRecordingModal({
  visible,
  initialTitle,
  lessonHint,
  onSave,
  onClose,
}: SaveRecordingModalProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const folders = useNotesStore((s) => s.folders);
  const addFolder = useNotesStore((s) => s.addFolder);
  const [title, setTitle] = useState(initialTitle);
  const [folderId, setFolderId] = useState<string | undefined>();
  const [createFolder, setCreateFolder] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setFolderId(undefined);
    }
  }, [visible, initialTitle]);

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHandle, { backgroundColor: theme.border }]} />
            <Text
              style={[styles.title, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}
            >
              {t("recording.saveTitle")}
            </Text>
            {lessonHint ? (
              <View style={[styles.hintBox, { backgroundColor: `${theme.primary}12` }]}>
                <Ionicons name="layers-outline" size={18} color={theme.primary} />
                <Text style={[styles.hintText, { color: theme.primary }]}>{lessonHint}</Text>
              </View>
            ) : null}

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {t("recording.saveNameLabel")}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t("recording.titlePlaceholder")}
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

            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {t("recording.saveFolderLabel")}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderScroll}>
              <Pressable
                onPress={() => setFolderId(undefined)}
                style={[
                  styles.folderChip,
                  {
                    backgroundColor: !folderId ? theme.primary : theme.background,
                    borderColor: !folderId ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: !folderId ? "#FFF" : theme.textPrimary,
                    fontFamily: fontFamily.medium,
                    fontSize: fontSize.caption,
                  }}
                >
                  {t("recording.noFolder")}
                </Text>
              </Pressable>
              {folders.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => setFolderId(f.id)}
                  style={[
                    styles.folderChip,
                    {
                      backgroundColor: folderId === f.id ? theme.primary : theme.background,
                      borderColor: folderId === f.id ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <FolderIcon
                    icon={f.icon}
                    size={16}
                    color={folderId === f.id ? "#FFFFFF" : theme.primary}
                    variant={folderId === f.id ? "Bold" : "Linear"}
                  />
                  <Text
                    style={{
                      color: folderId === f.id ? "#FFF" : theme.textPrimary,
                      fontFamily: fontFamily.medium,
                      fontSize: fontSize.caption,
                    }}
                  >
                    {f.name}
                  </Text>
                </Pressable>
              ))}
              <Pressable
                onPress={() => setCreateFolder(true)}
                style={[styles.folderChip, { borderColor: theme.primary, borderStyle: "dashed" }]}
              >
                <Ionicons name="add" size={18} color={theme.primary} />
                <Text style={{ color: theme.primary, fontFamily: fontFamily.medium }}>
                  {t("recording.newFolder")}
                </Text>
              </Pressable>
            </ScrollView>

            <Button
              label={t("recording.saveAndProcess")}
              onPress={() => {
                if (!title.trim()) return;
                onSave(title.trim(), folderId);
              }}
              fullWidth
              style={{ marginTop: 8 }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <FolderModal
        visible={createFolder}
        onClose={() => setCreateFolder(false)}
        onCreate={(name, color, icon) => {
          const id = `folder-${Date.now()}`;
          addFolder({
            id,
            userId: "local",
            name,
            color,
            icon,
            noteCount: 0,
            createdAt: new Date().toISOString(),
          });
          setFolderId(id);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,15,26,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "88%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { fontSize: fontSize.title, marginBottom: 12 },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  hintText: { flex: 1, fontSize: fontSize.caption, fontFamily: fontFamily.medium },
  label: { fontSize: fontSize.tiny, marginBottom: 6, fontFamily: fontFamily.medium },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: fontSize.body,
    marginBottom: 16,
  },
  folderScroll: { marginBottom: 8 },
  folderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
});
