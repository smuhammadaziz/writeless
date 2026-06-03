import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All good</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
  },
});
