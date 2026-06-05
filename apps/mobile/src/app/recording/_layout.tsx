import { Stack } from "expo-router";

export default function RecordingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="active" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="preparing" options={{ animation: "fade", gestureEnabled: false }} />
    </Stack>
  );
}
