import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";

const BASE_HEIGHTS = [14, 22, 16, 28, 18, 24, 12, 20, 15, 26, 17, 23, 13, 21, 19, 25, 16, 27, 14, 22];

function WaveBar({
  index,
  active,
  maxHeight,
}: {
  index: number;
  active: boolean;
  maxHeight: number;
}) {
  const theme = useTheme();
  const minH = 10;
  const peak = minH + (BASE_HEIGHTS[index % BASE_HEIGHTS.length] / 28) * maxHeight;
  const height = useSharedValue(minH);

  useEffect(() => {
    if (!active) {
      height.value = minH;
      return;
    }
    const duration = 280 + (index % 5) * 90;
    height.value = withRepeat(withTiming(peak, { duration }), -1, true);
  }, [active, height, index, peak]);

  const style = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        style,
        { backgroundColor: theme.primary, opacity: active ? 1 : 0.35 },
      ]}
    />
  );
}

interface WaveformVisualizerProps {
  active?: boolean;
  /** Fewer bars, shorter — for the idle recording hero card */
  variant?: "default" | "hero";
}

export function WaveformVisualizer({
  active = true,
  variant = "default",
}: WaveformVisualizerProps) {
  const isHero = variant === "hero";
  const barCount = isHero ? 16 : 20;
  const maxHeight = isHero ? 36 : 52;

  return (
    <View style={[styles.row, isHero && styles.rowHero]}>
      {Array.from({ length: barCount }).map((_, i) => (
        <WaveBar key={i} index={i} active={active} maxHeight={maxHeight} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 64,
    width: "100%",
  },
  rowHero: {
    height: 48,
    marginVertical: 4,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
});
