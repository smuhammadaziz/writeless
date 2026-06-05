import { StyleSheet, Text, View } from "react-native";
import { fontFamily, fontSize } from "../../constants/typography";
import { useTheme } from "../../hooks/useTheme";
import type { Utterance } from "../../types";

interface TranscriptDialogProps {
  utterances: Utterance[];
  teacherSpeaker: string;
  teacherLabel: string;
  studentsLabel: string;
}

export function TranscriptDialog({
  utterances,
  teacherSpeaker,
  teacherLabel,
  studentsLabel,
}: TranscriptDialogProps) {
  const theme = useTheme();

  return (
    <View style={styles.block}>
      {utterances.map((u, i) => {
        const isTeacher = u.speaker === teacherSpeaker;
        const role = isTeacher ? teacherLabel : studentsLabel;

        return (
          <View key={`${u.start}-${i}`} style={styles.turn}>
            <Text style={[styles.role, { color: theme.textSecondary, fontFamily: fontFamily.medium }]}>
              {role}
            </Text>
            <Text style={[styles.line, { color: theme.textPrimary, fontFamily: fontFamily.regular }]}>
              {u.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: 20,
    paddingTop: 4,
  },
  turn: {
    gap: 4,
  },
  role: {
    fontSize: fontSize.caption,
    letterSpacing: 0.2,
  },
  line: {
    fontSize: fontSize.body,
    lineHeight: 24,
  },
});
