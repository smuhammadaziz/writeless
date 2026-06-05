import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BOTTOM_NAV_CLEARANCE } from "../../components/navigation/BottomNav";
import { FolderModal } from "../../components/modals/FolderModal";
import { FolderIcon } from "../../components/icons/FolderIcon";
import { LibraryTimelineItem } from "../../components/library/LibraryTimelineItem";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotesStore } from "../../store/notesStore";
import { useRecordingStore } from "../../store/recordingStore";
import type { Folder, FolderIconId } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { formatDuration } from "../../utils/formatDuration";

type LibraryTab = "all" | "folders";

export default function LibraryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");
  const [folderModal, setFolderModal] = useState(false);
  const folders = useNotesStore((s) => s.folders);
  const addFolder = useNotesStore((s) => s.addFolder);
  const recordings = useRecordingStore((s) => s.recordings);
  const getNote = useNotesStore((s) => s.getNoteByRecordingId);
  const userId = useAuthStore((s) => s.user?.id) ?? "local";
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    return recordings.filter((r) => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
      const matchFolder = filter === "all" || r.folderId === filter;
      return matchSearch && matchFolder;
    });
  }, [recordings, search, filter]);

  const totalSeconds = useMemo(
    () => recordings.reduce((sum, r) => sum + r.duration, 0),
    [recordings]
  );

  const activeFolder = folders.find((f) => f.id === filter);
  const categoryLabel =
    filter === "all" ? t("library.allNotes") : (activeFolder?.name ?? t("library.all"));

  const showContext = (title: string) => {
    const options = [
      t("library.rename"),
      t("library.move"),
      t("library.share"),
      t("library.delete"),
      t("profile.cancel"),
    ];
    const handler = (index: number) => {
      if (index === 3) Alert.alert(t("library.delete"), title);
    };
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { options, cancelButtonIndex: 4, destructiveButtonIndex: 3 },
        handler
      );
    } else {
      Alert.alert(title, options.slice(0, 4).join("\n"));
    }
  };

  const handleCreateFolder = (name: string, color: string, icon: FolderIconId) => {
    const folder: Folder = {
      id: `folder-${Date.now()}`,
      userId,
      name,
      color,
      icon,
      noteCount: 0,
      createdAt: new Date().toISOString(),
    };
    addFolder(folder);
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 8) }]}>
        <View style={styles.topBarSide} />
        <Pressable
          onPress={() => setFolderModal(true)}
          style={[
            styles.addBtn,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="add" size={22} color={theme.primary} />
        </Pressable>
      </View>

      <View style={[styles.categoryPill, { backgroundColor: `${theme.primary}14` }]}>
        <Text style={[styles.categoryText, { color: theme.primary }]}>
          {categoryLabel}
        </Text>
      </View>

      <Text
        style={[
          styles.heroTitle,
          { color: theme.textPrimary, fontFamily: fontFamily.bold },
        ]}
      >
        {t("library.title")}
      </Text>

      <View style={styles.heroMeta}>
        <MetaChip
          icon="document-text-outline"
          label={t("library.notesCount", { count: recordings.length })}
          color={theme.primary}
        />
        <MetaChip
          icon="folder-outline"
          label={t("library.folderCount", { count: folders.length })}
          color={theme.primary}
        />
        <MetaChip
          icon="time-outline"
          label={formatDuration(totalSeconds)}
          color={theme.primary}
        />
      </View>

      <View style={[styles.tabs, { borderBottomColor: theme.border }]}>
        <TabButton
          label={t("library.tabNotes")}
          active={activeTab === "all"}
          onPress={() => {
            setActiveTab("all");
            setFilter("all");
          }}
          color={theme.primary}
          muted={theme.textSecondary}
        />
        <TabButton
          label={t("library.tabFolders")}
          active={activeTab === "folders"}
          onPress={() => setActiveTab("folders")}
          color={theme.primary}
          muted={theme.textSecondary}
        />
      </View>

      {activeTab === "folders" ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.folderTabs}
        >
          <FolderPill
            label={t("library.all")}
            active={filter === "all"}
            color={theme.primary}
            onPress={() => setFilter("all")}
          />
          {folders.map((f) => (
            <FolderPill
              key={f.id}
              label={f.name}
              icon={f.icon}
              active={filter === f.id}
              color={f.color}
              onPress={() => setFilter(f.id)}
            />
          ))}
        </ScrollView>
      ) : null}

      <View
        style={[
          styles.searchWrap,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search" size={18} color={theme.textSecondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t("library.search")}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.searchInput,
            { color: theme.textPrimary, fontFamily: fontFamily.regular },
          ]}
        />
      </View>
    </View>
  );

  return (
    <ErrorBoundary>
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
        edges={["left", "right", "bottom"]}
      >
        {filtered.length === 0 ? (
          <View style={styles.flex}>
            {listHeader}
            <View style={styles.empty}>
              <View
                style={[
                  styles.emptyIconWrap,
                  { backgroundColor: `${theme.primary}14`, borderColor: `${theme.primary}28` },
                ]}
              >
                <FolderIcon icon="library" size={36} color={theme.primary} variant="Bulk" />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  { color: theme.textPrimary, fontFamily: fontFamily.semibold },
                ]}
              >
                {t("library.emptyTitle")}
              </Text>
              <Text style={{ color: theme.textSecondary, textAlign: "center" }}>
                {t("library.emptySub")}
              </Text>
            </View>
          </View>
        ) : (
          <FlashList
            data={filtered}
            estimatedItemSize={200}
            ListHeaderComponent={listHeader}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: BOTTOM_NAV_CLEARANCE + Math.max(insets.bottom, 8) + 16,
            }}
            renderItem={({ item, index }) => {
              const folder = folders.find((f) => f.id === item.folderId);
              const note = getNote(item.id);
              return (
                <LibraryTimelineItem
                  recording={item}
                  note={note}
                  subjectLabel={folder?.name}
                  accentColor={folder?.color ?? theme.primary}
                  isFirst={index === 0}
                  isLast={index === filtered.length - 1}
                  onPress={() => note && router.push(`/note/${note.id}`)}
                  onLongPress={() => showContext(item.title)}
                />
              );
            }}
          />
        )}

        <FolderModal
          visible={folderModal}
          onClose={() => setFolderModal(false)}
          onCreate={handleCreateFolder}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
}

function MetaChip({
  icon,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.metaChip}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.metaChipText, { color }]}>{label}</Text>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
  color,
  muted,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color: string;
  muted: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Text
        style={[
          styles.tabText,
          {
            color: active ? color : muted,
            fontFamily: active ? fontFamily.semibold : fontFamily.medium,
          },
        ]}
      >
        {label}
      </Text>
      {active ? <View style={[styles.tabLine, { backgroundColor: color }]} /> : null}
    </Pressable>
  );
}

function FolderPill({
  label,
  icon,
  active,
  color,
  onPress,
}: {
  label: string;
  icon?: FolderIconId;
  active: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.folderPill,
        {
          backgroundColor: active ? color : "transparent",
          borderColor: active ? color : `${color}55`,
        },
      ]}
    >
      {icon ? (
        <FolderIcon icon={icon} size={14} color={active ? "#FFF" : color} variant={active ? "Bold" : "Linear"} />
      ) : null}
      <Text style={{ color: active ? "#FFF" : color, fontFamily: fontFamily.medium }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, paddingHorizontal: 20 },
  headerBlock: { paddingBottom: 8 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  topBarSide: { width: 44 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: fontSize.tiny,
    fontFamily: fontFamily.semibold,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    marginBottom: 10,
  },
  heroMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaChipText: { fontSize: fontSize.tiny, fontFamily: fontFamily.medium },
  tabs: {
    flexDirection: "row",
    gap: 24,
    borderBottomWidth: 1,
    marginBottom: 14,
  },
  tabBtn: { paddingBottom: 10 },
  tabText: { fontSize: fontSize.body },
  tabLine: {
    height: 2,
    borderRadius: 1,
    marginTop: 8,
  },
  folderTabs: { gap: 8, paddingBottom: 14 },
  folderPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: fontSize.body },
  empty: { alignItems: "center", padding: 40, gap: 8, flex: 1 },
  emptyTitle: { fontSize: fontSize.subtitle },
});
