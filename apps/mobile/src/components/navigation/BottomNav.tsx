import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Book1, Home2, Microphone2 } from "iconsax-react-nativejs";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppIcon } from "../icons/AppIcon";
import { useTheme } from "../../hooks/useTheme";
import { useRecordingStore } from "../../store/recordingStore";

const NAV_BAR_HEIGHT = 60;

function SideTab({
  active,
  icon,
  onPress,
}: {
  active: boolean;
  icon: typeof Home2 | typeof Book1;
  onPress: () => void;
}) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        scale.value = withSpring(0.9, {}, () => {
          scale.value = withSpring(1);
        });
        void Haptics.selectionAsync();
        onPress();
      }}
      style={styles.sideTab}
    >
      <Animated.View style={[styles.sideTabInner, animStyle]}>
        <AppIcon
          icon={icon}
          size={26}
          color={active ? theme.primary : theme.textSecondary}
          active={active}
        />
        {active ? (
          <View style={[styles.dot, { backgroundColor: theme.primary }]} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export function BottomNav() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isHome = pathname.includes("/home");
  const isLibrary = pathname.includes("/library");
  const isRecording = useRecordingStore((s) => s.flowStatus === "recording");

  const openRecording = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) {
      router.dismissTo("/(tabs)/home");
    } else {
      router.push("/recording");
    }
  };

  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.surface,
            shadowColor: theme.textPrimary,
          },
        ]}
      >
        <SideTab
          active={isHome}
          icon={Home2}
          onPress={() => router.push("/(tabs)/home")}
        />

        <Pressable onPress={openRecording} style={styles.micTab}>
          <LinearGradient
            colors={["#6C63FF", "#7B73FF"]}
            style={styles.micButton}
          >
            <AppIcon icon={Microphone2} size={26} color="#FFFFFF" variant="Bold" />
          </LinearGradient>
        </Pressable>

        <SideTab
          active={isLibrary}
          icon={Book1}
          onPress={() => router.push("/(tabs)/library")}
        />
      </View>
    </View>
  );
}

export const BOTTOM_NAV_CLEARANCE = NAV_BAR_HEIGHT + 24;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 52,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 280,
    height: NAV_BAR_HEIGHT,
    borderRadius: 30,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  sideTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  sideTabInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
  micTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  micButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
