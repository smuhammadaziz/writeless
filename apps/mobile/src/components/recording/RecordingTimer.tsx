import { StyleSheet, Text } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { formatDuration } from "../../utils/formatDuration";
import { useTheme } from "../../hooks/useTheme";

interface RecordingTimerProps {
  seconds: number;
}

export function RecordingTimer({ seconds }: RecordingTimerProps) {
  const theme = useTheme();
  return (
    <Text
      style={[
        styles.timer,
        { color: theme.textPrimary, fontFamily: fontFamily.bold },
      ]}
    >
      {formatDuration(seconds)}
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 48,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
});
