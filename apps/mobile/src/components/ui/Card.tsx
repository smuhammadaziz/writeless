import { StyleSheet, View, type ViewProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  glass?: boolean;
}

export function Card({ children, glass = true, style, ...rest }: CardProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: glass ? `${theme.surface}F2` : theme.surface,
          borderColor: theme.border,
          shadowColor: theme.textPrimary,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
});
