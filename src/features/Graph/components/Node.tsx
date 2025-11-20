import {
  Circle,
  Text,
  useFonts,
  matchFont,
  Group,
} from '@shopify/react-native-skia';
import { GraphNode } from '@/shared/types/graphType';
import {COLORS} from '@constants/COLORS';
import { NODE_RADIUS } from '@features/Graph/constants';
import { useSmoothValue } from '@features/Graph/hooks/useSmoothValue';

interface NodeProps {
  node: GraphNode;
  opacity?: number;
}

export default function Node({ node, opacity = 1 }: NodeProps) {
  const animatedOpacity = useSmoothValue(opacity);
  const fontMgr = useFonts({
    'NotoSansKR-SemiBold': [
      require('../../../../assets/fonts/NotoSansKR-SemiBold.ttf')
    ]
  });

  if (!fontMgr) {
    return null;
  }

  const fontStyle = {
    fontFamily: 'NotoSansKR-SemiBold',
    fontSize: 10
  } as const;
  const font = matchFont(fontStyle, fontMgr);
  const centeredX = font
    ? (() => {
        const metrics = font.measureText(node.name);
        const textWidth = metrics.width;
        return node.x - textWidth / 2;
      })()
    : node.x;

  // 노드 타입에 따라 색상과 크기 결정
  const nodeColor = 
    node.nodeType === 'group' ? COLORS.NEUTRAL_800 :
    node.nodeType === 'tag' ? COLORS.NEUTRAL_800 : // 보라색
    COLORS.NEUTRAL_500;
  const nodeRadius = 
    node.nodeType === 'group' || node.nodeType === 'tag' 
      ? NODE_RADIUS * 1.2 
      : NODE_RADIUS;

  return (
    <Group opacity={animatedOpacity}>
      <Circle
        cx={node.x}
        cy={node.y}
        r={nodeRadius}
        color={nodeColor}
      />
      {font && (
        <Text
          x={centeredX}
          y={node.y + nodeRadius + 19}
          text={node.name}
          color={COLORS.BLACK}
          font={font}
        />
      )}
    </Group>
  );
}

