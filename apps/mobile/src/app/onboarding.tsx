import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingHero } from "../components/onboarding/OnboardingHero";
import { PrimaryArrowButton } from "../components/ui/PrimaryArrowButton";
import { lightColors } from "../constants/colors";
import { fontFamily, fontSize } from "../constants/typography";
import { useTranslation } from "../hooks/useTranslation";
import { useSettingsStore } from "../store/settingsStore";

const { width } = Dimensions.get("window");
const STEP_COUNT = 2;

type StepConfig = {
  key: string;
  overline: string;
  title: string;
  sub: string;
  illustration: 1 | 2;
  badge1Title: string;
  badge1Sub: string;
  badge2Title: string;
  badge2Sub: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const onboardingDone = useSettingsStore((s) => s.onboardingDone);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (onboardingDone) router.replace("/login");
  }, [onboardingDone, router]);
  const listRef = useRef<FlatList<StepConfig>>(null);

  const steps: StepConfig[] = [
    {
      key: "1",
      overline: t("onboarding.step1.overline"),
      title: t("onboarding.step1.title"),
      sub: t("onboarding.step1.sub"),
      illustration: 1,
      badge1Title: t("onboarding.step1.badge1Title"),
      badge1Sub: t("onboarding.step1.badge1Sub"),
      badge2Title: t("onboarding.step1.badge2Title"),
      badge2Sub: t("onboarding.step1.badge2Sub"),
    },
    {
      key: "2",
      overline: t("onboarding.step2.overline"),
      title: t("onboarding.step2.title"),
      sub: t("onboarding.step2.sub"),
      illustration: 2,
      badge1Title: t("onboarding.step2.badge1Title"),
      badge1Sub: t("onboarding.step2.badge1Sub"),
      badge2Title: t("onboarding.step2.badge2Title"),
      badge2Sub: t("onboarding.step2.badge2Sub"),
    },
  ];

  const finish = async () => {
    await setOnboardingDone(true);
    router.replace("/login");
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setStep(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const next = async () => {
    if (step < STEP_COUNT - 1) {
      listRef.current?.scrollToIndex({ index: step + 1, animated: true });
      setStep(step + 1);
      return;
    }
    await finish();
  };

  const renderSlide: ListRenderItem<StepConfig> = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.slideContent}>
        <OnboardingHero
          step={item.illustration}
          badge1Title={item.badge1Title}
          badge1Sub={item.badge1Sub}
          badge2Title={item.badge2Title}
          badge2Sub={item.badge2Sub}
        />
        <View style={styles.copy}>
          <Text style={[styles.overline, { fontFamily: fontFamily.bold }]}>{item.overline}</Text>
          <Text style={[styles.title, { fontFamily: fontFamily.bold }]}>{item.title}</Text>
          <Text style={[styles.sub, { fontFamily: fontFamily.regular }]}>{item.sub}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerSide} />
        <View style={styles.dots}>
          {steps.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === step ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <Pressable onPress={() => void finish()} style={styles.headerSide}>
          <Text style={[styles.skip, { fontFamily: fontFamily.medium }]}>
            {t("onboarding.skip")}
          </Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.key}
        renderItem={renderSlide}
      />

      <View style={styles.footer}>
        <PrimaryArrowButton
          label={step === STEP_COUNT - 1 ? t("onboarding.getStarted") : t("onboarding.next")}
          onPress={() => void next()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerSide: {
    width: 100,
    alignItems: "flex-end",
  },
  skip: {
    color: lightColors.textSecondary,
    fontSize: fontSize.caption,
  },
  dots: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 28,
    backgroundColor: lightColors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#D1D5DB",
  },
  list: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  slideContent: {
    alignItems: "center",
  },
  copy: {
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 8,
  },
  overline: {
    fontSize: fontSize.tiny,
    letterSpacing: 2,
    color: lightColors.primary,
    textAlign: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 26,
    lineHeight: 34,
    color: lightColors.textPrimary,
    textAlign: "center",
  },
  sub: {
    marginTop: 12,
    fontSize: fontSize.body,
    lineHeight: 24,
    color: lightColors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
  },
});
