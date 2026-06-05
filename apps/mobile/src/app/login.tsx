import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppLogo } from "../components/ui/AppLogo";
import { fontFamily, fontSize } from "../constants/typography";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { useTranslation } from "../hooks/useTranslation";

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();
  const { signInWithGoogle } = useAuth();

  const goHome = async () => {
    await signInWithGoogle();
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <AppLogo size={56} color={theme.primary} />
        <Text style={[styles.title, { color: theme.textPrimary, fontFamily: fontFamily.bold }]}>
          {t("login.welcome")}
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary, fontFamily: fontFamily.regular }]}>
          {t("login.sub")}
        </Text>

        <Pressable
          onPress={() => void goHome()}
          style={({ pressed }) => [
            styles.googleBtn,
            {
              backgroundColor: theme.surface,
              shadowColor: theme.textPrimary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <GoogleIcon />
          <Text style={[styles.googleText, { color: theme.textPrimary, fontFamily: fontFamily.semibold }]}>
            {t("login.google")}
          </Text>
        </Pressable>

        <Text style={[styles.privacy, { color: theme.textSecondary }]}>
          {t("login.privacy")}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  title: { fontSize: fontSize.title, marginTop: 16, textAlign: "center" },
  sub: { fontSize: fontSize.body, textAlign: "center", marginBottom: 24, lineHeight: 24 },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 999,
    width: "100%",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  googleText: { fontSize: fontSize.body },
  privacy: { fontSize: fontSize.tiny, textAlign: "center", marginTop: 24, lineHeight: 18 },
});
