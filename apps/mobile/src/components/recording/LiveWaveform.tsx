import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { useRecordingStore } from "../../store/recordingStore";

const BAR_COUNT = 24;

function LiveBar({
  index,
  level,
  barColor,
}: {
  index: number;
  level: number;
  barColor: string;
}) {
  const height = useSharedValue(10);
  const target = 10 + level * (28 + (index % 5) * 4);

  useEffect(() => {
    height.value = withSpring(target, { damping: 14, stiffness: 180 });
  }, [height, target, level]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        style,
        { backgroundColor: barColor, opacity: 0.35 + level * 0.65 },
      ]}
    />
  );
}

export function LiveWaveform({ variant = "default" }: { variant?: "default" | "light" }) {
  const theme = useTheme();
  const level = useRecordingStore((s) => s.audioLevel);
  const barColor = variant === "light" ? "#FFFFFF" : theme.primary;
  const effectiveLevel = Math.max(level, 0.14);

  return (
    <View style={styles.row}>
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <LiveBar
          key={i}
          index={i}
          level={effectiveLevel * (0.65 + 0.35 * ((i * 17) % 10) / 10)}
          barColor={barColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    height: 72,
    width: "100%",
    paddingHorizontal: 8,
  },
  bar: {
    width: 4,
    borderRadius: 3,
    minHeight: 8,
  },
});
