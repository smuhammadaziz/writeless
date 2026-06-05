import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

interface RecordButtonProps {
  onPress: () => void;
  size?: number;
  pulsing?: boolean;
}

export function RecordButton({
  onPress,
  size = 72,
  pulsing = true,
}: RecordButtonProps) {
  const scale = useSharedValue(1);
  const ring1 = useSharedValue(1);
  const ring2 = useSharedValue(1);

  useEffect(() => {
    if (!pulsing) return;
    ring1.value = withRepeat(
      withSequence(withTiming(1.35, { duration: 1200 }), withTiming(1, { duration: 0 })),
      -1
    );
    ring2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(1.5, { duration: 1200 }),
        withTiming(1, { duration: 0 })
      ),
      -1
    );
  }, [pulsing, ring1, ring2]);

  const ringStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: ring1.value }],
    opacity: 0.25,
  }));
  const ringStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: ring2.value }],
    opacity: 0.15,
  }));
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.92, {}, () => {
      scale.value = withSpring(1);
    });
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <View style={[styles.wrap, { width: size * 2, height: size * 2 }]}>
      {pulsing ? (
        <>
          <Animated.View
            style={[
              styles.ring,
              ringStyle1,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
          <Animated.View
            style={[
              styles.ring,
              ringStyle2,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        </>
      ) : null}
      <Animated.View style={btnStyle}>
        <Pressable onPress={handlePress}>
          <LinearGradient
            colors={["#6C63FF", "#A78BFA"]}
            style={[
              styles.button,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Ionicons name="mic" size={size * 0.4} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  ring: {
    position: "absolute",
    backgroundColor: "#6C63FF",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
});
