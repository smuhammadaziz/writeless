import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTranslation } from "../../hooks/useTranslation";

export function OfflineBanner() {
  const { t } = useTranslation();
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{t("common.offline")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#F59E0B",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  text: {
    color: "#1A1A2E",
    fontSize: fontSize.caption,
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
});
