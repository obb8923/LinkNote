import { useEffect, useRef } from 'react';
import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceCollide,
  Simulation,
} from 'd3-force';
import { useSharedValue } from 'react-native-reanimated';
import { GraphNode, GraphLink } from '@/shared/types/graphType';
import { 
  NODE_RADIUS, 
  FORCE_PRESET_DEFAULT, 
  FORCE_PRESET_SOFT,
  FORCE_PRESET_SNAPPY,
  FORCE_PRESET_RELAXED,
  FORCE_PRESET_CLUSTERED,
  FORCE_PRESET_SPRINGY,
  FORCE_PRESET_STATIC,
} from '@features/Graph/constants';

export function useGraphLayout(
  nodes: GraphNode[],
  links: GraphLink[],
  width: number,
  height: number,
): {
  tickSignal: { value: number };
  simulationRef: React.MutableRefObject<Simulation<GraphNode, GraphLink> | null>;
  fixNode: (nodeId: string) => void;
  unfixNode: (nodeId: string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
} {
  const tickSignal = useSharedValue(0);
  const simulationRef = useRef<Simulation<GraphNode, GraphLink> | null>(null);
  const nodesRef = useRef<GraphNode[]>(nodes);
  const nodeRadius = NODE_RADIUS; // 노드 반지름

  const forceConfig = FORCE_PRESET_DEFAULT;
  // 최신 nodes를 ref에 저장
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;
    if (!width || !height) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const minX = nodeRadius;
    const maxX = width - nodeRadius;
    const minY = nodeRadius;
    const maxY = height - nodeRadius;

    const sim: Simulation<GraphNode, GraphLink> = forceSimulation(nodes)
      .force(
        'charge',
        forceManyBody()
          .strength(forceConfig.CHARGE.STRENGTH)
          .distanceMin(forceConfig.CHARGE.DISTANCE_MIN)
          .distanceMax(forceConfig.CHARGE.DISTANCE_MAX)
          .theta(forceConfig.CHARGE.THETA),
      )
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .distance(forceConfig.LINK.DISTANCE)
          .strength(forceConfig.LINK.STRENGTH)
          .iterations(forceConfig.LINK.ITERATIONS),
      )
      .force(
        'center',
        forceCenter(centerX, centerY).strength(forceConfig.CENTER.STRENGTH),
      )
      .force(
        'collide',
          forceCollide(nodeRadius * forceConfig.COLLIDE.RADIUS_MULTIPLIER)
          .strength(forceConfig.COLLIDE.STRENGTH)
          .iterations(forceConfig.COLLIDE.ITERATIONS),
      )
      .alphaDecay(forceConfig.SIMULATION.ALPHA_DECAY)
      .velocityDecay(forceConfig.SIMULATION.VELOCITY_DECAY)
      .alphaMin(forceConfig.SIMULATION.ALPHA_MIN)
      .on('tick', () => {
        // 노드가 화면 밖으로 나가지 않도록 제한
        nodes.forEach((node) => {
          node.x = Math.max(minX, Math.min(maxX, node.x));
          node.y = Math.max(minY, Math.min(maxY, node.y));
        });
        // d3-force가 노드 객체를 직접 수정하므로 tickSignal을 업데이트하여 리렌더링 트리거
        tickSignal.value = tickSignal.value + 1;
      });

    simulationRef.current = sim;

    return () => {
      sim.stop();
      simulationRef.current = null;
    };
  }, [nodes, links, tickSignal, width, height]);

  const fixNode = (nodeId: string) => {
    if (simulationRef.current) {
      // 시뮬레이션의 노드 배열에서 찾기 (d3-force가 직접 수정하는 노드 객체)
      const simNodes = simulationRef.current.nodes();
      const node = simNodes.find((n) => n.id === nodeId);
      if (node) {
        node.fx = node.x;
        node.fy = node.y;
        simulationRef.current.alpha(1).restart();
      }
    }
  };

  const unfixNode = (nodeId: string) => {
    if (simulationRef.current) {
      // 시뮬레이션의 노드 배열에서 찾기 (d3-force가 직접 수정하는 노드 객체)
      const simNodes = simulationRef.current.nodes();
      const node = simNodes.find((n) => n.id === nodeId);
      if (node) {
        node.fx = null;
        node.fy = null;
        simulationRef.current.alpha(1).restart();
      }
    }
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    if (simulationRef.current) {
      const simNodes = simulationRef.current.nodes();
      const node = simNodes.find((n) => n.id === nodeId);
      if (node) {
        // 노드 위치 업데이트 및 고정
        node.x = x;
        node.y = y;
        node.fx = x;
        node.fy = y;
        // 시뮬레이션 재시작하여 다른 노드들이 반응하도록 함
        simulationRef.current.alpha(1).restart();
      }
    }
  };

  return { tickSignal, simulationRef, fixNode, unfixNode, updateNodePosition };
}

