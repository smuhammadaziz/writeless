import {
  Book1,
  ChemicalGlass,
  ColorSwatch,
  Folder,
  Health,
  Microscope,
  Monitor,
  Ruler,
  Scroll,
  type Icon,
} from "iconsax-react-nativejs";
import { normalizeFolderIcon } from "../../constants/folderIcons";
import type { FolderIconId } from "../../types";

const ICON_MAP: Record<FolderIconId, Icon> = {
  folder: Folder,
  laptop: Monitor,
  flask: ChemicalGlass,
  ruler: Ruler,
  library: Book1,
  palette: ColorSwatch,
  dna: Health,
  scroll: Scroll,
  book: Book1,
  microscope: Microscope,
};

type IconsaxVariant = "Linear" | "Outline" | "Broken" | "Bold" | "Bulk" | "TwoTone";

interface FolderIconProps {
  icon: string;
  size?: number;
  color?: string;
  variant?: IconsaxVariant;
  /** @deprecated Use `variant` instead. */
  strokeWidth?: number;
}

export function FolderIcon({
  icon,
  size = 20,
  color = "#6C63FF",
  variant = "Linear",
  strokeWidth,
}: FolderIconProps) {
  const id = normalizeFolderIcon(icon);
  const IconComponent = ICON_MAP[id];
  const resolvedVariant: IconsaxVariant =
    variant !== "Linear" ? variant : strokeWidth != null && strokeWidth >= 2.25 ? "Bold" : "Linear";

  return <IconComponent size={size} color={color} variant={resolvedVariant} />;
}
