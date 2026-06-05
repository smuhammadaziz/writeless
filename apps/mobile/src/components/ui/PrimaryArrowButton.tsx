import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";

interface PrimaryArrowButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryArrowButton({
  label,
  onPress,
  disabled = false,
}: PrimaryArrowButtonProps) {
  const handlePress = () => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.9 : 1 }]}
    >
      <LinearGradient
        colors={["#6C63FF", "#7B73FF", "#6C63FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.button}
      >
        <Text style={[styles.label, { fontFamily: fontFamily.bold }]}>{label}</Text>
        <View style={styles.iconWrap}>
          <Ionicons name="arrow-forward" size={20} color="#6C63FF" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
  },
  label: {
    color: "#FFFFFF",
    fontSize: fontSize.body,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
