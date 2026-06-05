import Svg, { Path, Text as SvgText } from "react-native-svg";

interface AppLogoProps {
  size?: number;
  color?: string;
  showName?: boolean;
}

export function AppLogo({
  size = 80,
  color = "#FFFFFF",
  showName = false,
}: AppLogoProps) {
  return (
    <Svg width={size} height={showName ? size + 28 : size} viewBox="0 0 100 120">
      <Path
        d="M28 18 L72 18 L72 82 Q72 98 50 98 Q28 98 28 82 Z"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinejoin="round"
      />
      <Path
        d="M38 38 L62 38 M50 38 L50 72"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
      />
      {showName ? (
        <SvgText
          x="50"
          y="115"
          fill={color}
          fontSize="14"
          fontWeight="600"
          textAnchor="middle"
        >
          Writeless
        </SvgText>
      ) : null}
    </Svg>
  );
}
