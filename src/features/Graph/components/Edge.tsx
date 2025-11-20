import { Line, Group } from '@shopify/react-native-skia';
import { GraphLink } from '@/shared/types/graphType';
import { COLORS } from '@constants/COLORS';
import { useSmoothValue } from '@features/Graph/hooks/useSmoothValue';

interface EdgeProps {
  link: GraphLink;
  isHighlighted?: boolean;
  opacity?: number;
}

export default function Edge({ link, isHighlighted = false, opacity = 1 }: EdgeProps) {
  const highlightProgress = useSmoothValue(isHighlighted ? 1 : 0);
  const animatedOpacity = useSmoothValue(opacity);
  const strokeColor = interpolateHexColor('#999999', COLORS.PRIMARY, highlightProgress);
  return (
    <Group opacity={animatedOpacity}>
      {/* 실제 엣지 라인 */}
      <Line
        p1={{ x: link.source.x, y: link.source.y }}
        p2={{ x: link.target.x, y: link.target.y }}
        color={strokeColor}
        strokeWidth={2}
      />
    </Group>
  );
}

const hexToRgb = (hex: string) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const interpolateHexColor = (from: string, to: string, progress: number) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const fromRgb = hexToRgb(from);
  const toRgb = hexToRgb(to);

  const r = Math.round(fromRgb.r + (toRgb.r - fromRgb.r) * clamped);
  const g = Math.round(fromRgb.g + (toRgb.g - fromRgb.g) * clamped);
  const b = Math.round(fromRgb.b + (toRgb.b - fromRgb.b) * clamped);

  return rgbToHex(r, g, b);
};

