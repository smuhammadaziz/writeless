import Svg, { Circle, Path, Rect } from "react-native-svg";
import { lightColors } from "../../constants/colors";

interface IllustrationProps {
  step: 1 | 2;
  width?: number;
  height?: number;
}

export function OnboardingIllustration({
  step,
  width = 280,
  height = 200,
}: IllustrationProps) {
  const primary = lightColors.primary;
  const accent = lightColors.accent;
  const surface = lightColors.surface;
  const border = lightColors.border;

  if (step === 1) {
    return (
      <Svg width={width} height={height} viewBox="0 0 280 200">
        <Rect x="90" y="30" width="100" height="160" rx="16" fill={surface} stroke={primary} strokeWidth={3} />
        <Circle cx="140" cy="160" r="8" fill={primary} />
        {[0, 1, 2, 3].map((i) => (
          <Path
            key={i}
            d={`M ${140 - 50 - i * 18} 80 Q ${140 - 30} ${60 + i * 10} ${140 - 10} 80`}
            stroke={accent}
            strokeWidth={3 - i * 0.4}
            fill="none"
            opacity={0.9 - i * 0.15}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <Path
            key={`r-${i}`}
            d={`M ${140 + 50 + i * 18} 80 Q ${140 + 30} ${60 + i * 10} ${140 + 10} 80`}
            stroke={accent}
            strokeWidth={3 - i * 0.4}
            fill="none"
            opacity={0.9 - i * 0.15}
          />
        ))}
        <Circle cx="140" cy="70" r="14" fill={primary} />
        <Rect x="133" y="55" width="14" height="22" rx="4" fill="#FFFFFF" />
      </Svg>
    );
  }

  return (
    <Svg width={width} height={height} viewBox="0 0 280 200">
      <Rect x="60" y="40" width="160" height="120" rx="12" fill={surface} stroke={primary} strokeWidth={3} />
      <Path d="M80 70 H200 M80 95 H180 M80 120 H160" stroke={border} strokeWidth={4} strokeLinecap="round" />
      {[
        { cx: 220, cy: 50 },
        { cx: 245, cy: 75 },
        { cx: 235, cy: 100 },
        { cx: 250, cy: 55 },
      ].map((s, i) => (
        <Path
          key={i}
          d={`M ${s.cx} ${s.cy} l4 -8 l4 12 l-6 -4 l-2 10 z`}
          fill={accent}
          opacity={0.85}
        />
      ))}
    </Svg>
  );
}
