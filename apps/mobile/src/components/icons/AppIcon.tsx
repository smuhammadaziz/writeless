import type { Icon, IconProps } from "iconsax-react-nativejs";

export type IconsaxVariant = NonNullable<IconProps["variant"]>;

interface AppIconProps {
  icon: Icon;
  size?: number;
  color?: string;
  variant?: IconsaxVariant;
  /** Active tabs / selected states use Bold when variant is omitted. */
  active?: boolean;
}

export function AppIcon({
  icon: IconComponent,
  size = 24,
  color = "currentColor",
  variant,
  active = false,
}: AppIconProps) {
  const resolvedVariant: IconsaxVariant = variant ?? (active ? "Bold" : "Outline");

  return <IconComponent size={size} color={color} variant={resolvedVariant} />;
}
