import type { FolderIconId } from "../types";

export const FOLDER_ICON_OPTIONS: FolderIconId[] = [
  "folder",
  "laptop",
  "flask",
  "ruler",
  "library",
  "palette",
  "dna",
  "scroll",
  "book",
  "microscope",
];

export const DEFAULT_FOLDER_ICON: FolderIconId = "folder";

/** Maps legacy emoji folder icons to Iconsax ids. */
export const LEGACY_FOLDER_ICON_MAP: Record<string, FolderIconId> = {
  "📁": "folder",
  "💻": "laptop",
  "🧪": "flask",
  "📐": "ruler",
  "📚": "library",
  "🎨": "palette",
  "🧬": "dna",
  "📜": "scroll",
  "✨": "folder",
};

export function normalizeFolderIcon(icon: string): FolderIconId {
  if (FOLDER_ICON_OPTIONS.includes(icon as FolderIconId)) {
    return icon as FolderIconId;
  }
  return LEGACY_FOLDER_ICON_MAP[icon] ?? DEFAULT_FOLDER_ICON;
}
