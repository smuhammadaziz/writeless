import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BottomNav } from "../../components/navigation/BottomNav";
import { useTheme } from "../../hooks/useTheme";

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Slot />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
