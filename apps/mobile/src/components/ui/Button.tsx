import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  fullWidth = false,
}: ButtonProps) {
  const theme = useTheme();

  const handlePress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const bg =
    variant === "primary"
      ? theme.primary
      : variant === "secondary"
        ? theme.surface
        : "transparent";
  const textColor =
    variant === "primary"
      ? "#FFFFFF"
      : variant === "secondary"
        ? theme.textPrimary
        : theme.primary;
  const borderWidth = variant === "secondary" ? 1 : 0;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: bg,
          borderColor: theme.border,
          borderWidth,
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: textColor, fontFamily: fontFamily.semibold },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: { width: "100%" },
  label: { fontSize: fontSize.body },
});
