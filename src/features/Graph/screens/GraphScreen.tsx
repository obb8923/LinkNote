import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useWindowDimensions, View, Alert, StyleSheet, Platform } from 'react-native';
import { Canvas, Group } from '@shopify/react-native-skia';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  type GestureStateChangeEvent,
  type GestureUpdateEvent,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import type { ForceLink } from 'd3-force';
import { Background, TabBar, ScreenHeader } from '@components/index';
import { useGraphStore } from '@stores/graphStore';
import { usePersonStore } from '@stores/personStore';
import { useGraphLayout } from '@features/Graph/hooks/useGraphLayout';
import Node from '@features/Graph/components/Node';
import Edge from '@features/Graph/components/Edge';
import {
  FilterDropdown,
  type FilterValue,
  GROUP_ALL_VALUE,
  TAG_ALL_VALUE,
} from '@features/Graph/components/FilterDropdown';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { TAB_BAR_HEIGHT } from '@constants/TAB_NAV_OPTIONS';
import { NODE_RADIUS } from '@features/Graph/constants';
import type { GraphLink, GraphNode } from '@/shared/types/graphType';
import uuid from 'react-native-uuid';

export const GraphScreen = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const nodes = useGraphStore((s) => s.nodes);
  const links = useGraphStore((s) => s.links);
  const people = usePersonStore((s) => s.people);
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasWidth = (width - insets.left - insets.right) * 0.9;
  const canvasHeight = (height - insets.top - insets.bottom - 56 - TAB_BAR_HEIGHT) * 0.9;
  const [, setRenderTick] = useState(0);
  const touchStartX = useSharedValue(0);
  const touchStartY = useSharedValue(0);
  const touchStartTimestamp = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const draggedNodeId = useSharedValue<string | null>(null);
  const canvasOffsetX = useSharedValue(0);
  const canvasOffsetY = useSharedValue(0);
  const canvasContainerRef = useRef<View>(null);
  const TAP_THRESHOLD = 10;
  const TAP_TIME_THRESHOLD = 200;
  const EDGE_TOUCH_WIDTH = 20;
  const NODE_HIT_RADIUS = NODE_RADIUS * 2.5;
  const DIMMED_OPACITY = 0.2;

  // 모든 그룹과 태그 추출
  const { groups, tags } = useMemo(() => {
    const groupSet = new Set<string>();
    const tagSet = new Set<string>();

    people.forEach((person) => {
      person.properties.forEach((property) => {
        if (property.type === 'organizations') {
          property.values.forEach((value) => groupSet.add(value));
        } else if (property.type === 'tags') {
          property.values.forEach((value) => tagSet.add(value));
        }
      });
    });

    return {
      groups: Array.from(groupSet).sort(),
      tags: Array.from(tagSet).sort(),
    };
  }, [people]);

  // 필터링된 노드와 링크
  const { filteredNodes, filteredLinks } = useMemo(() => {
    if (!selectedFilter) {
      return { filteredNodes: nodes, filteredLinks: links };
    }

    const width = canvasWidth || 400;
    const height = canvasHeight || 600;

    const buildGroupView = (targetGroupNames: string[]) => {
      if (targetGroupNames.length === 0) {
        return { filteredNodes: [] as GraphNode[], filteredLinks: [] as GraphLink[] };
      }

      // 그룹 노드 ID 생성 시 중복 방지 보장
      const groupNodeIds = new Set<string>();
      const groupNodes: GraphNode[] = targetGroupNames.map((groupName) => {
        // 그룹 노드는 'node-group-' 접두사 사용하여 태그와 명확히 구분
        const nodeId = `node-group-${groupName}`;
        if (groupNodeIds.has(nodeId)) {
          // 중복 발생 시 UUID 추가 (이론적으로는 발생하지 않아야 함)
          const uniqueId = `${nodeId}-${uuid.v4()}`;
          groupNodeIds.add(uniqueId);
          return {
            id: uniqueId,
            name: groupName,
            nodeType: 'group' as const,
            x: Math.random() * width,
            y: Math.random() * height,
          };
        }
        groupNodeIds.add(nodeId);
        return {
          id: nodeId,
          name: groupName,
          nodeType: 'group' as const,
          x: Math.random() * width,
          y: Math.random() * height,
        };
      });

      const groupNodeMap = new Map(groupNodes.map((node) => [node.name, node]));
      const visiblePersonNodes: GraphNode[] = [];
      const visiblePersonIds = new Set<string>();
      const groupLinks: GraphLink[] = [];
      const groupLinkIds = new Set<string>(); // 링크 ID 중복 방지

      nodes.forEach((personNode) => {
        if (!personNode.personId) return;
        const person = people.find((p) => p.id === personNode.personId);
        if (!person) return;

        const organizationProperty = person.properties.find((property) => property.type === 'organizations');
        const organizations = organizationProperty?.values ?? [];
        // 중복 그룹 제거
        const uniqueOrganizations = Array.from(new Set(organizations));
        const matchedGroups = uniqueOrganizations.filter((groupName) => groupNodeMap.has(groupName));

        if (matchedGroups.length > 0) {
          visiblePersonNodes.push(personNode);
          visiblePersonIds.add(personNode.id);

          matchedGroups.forEach((groupName) => {
            const groupNode = groupNodeMap.get(groupName);
            if (!groupNode) return;

            const linkId = `group-link-${personNode.id}-${groupNode.id}`;
            // 중복 링크 ID 체크
            if (!groupLinkIds.has(linkId)) {
              groupLinkIds.add(linkId);
              groupLinks.push({
                id: linkId,
                source: personNode,
                target: groupNode,
                type: 'group',
                strength: 0.3,
              });
            }
          });
        }
      });

      const relationLinks = links.filter(
        (link) => visiblePersonIds.has(link.source.id) && visiblePersonIds.has(link.target.id),
      );

      return {
        filteredNodes: [...visiblePersonNodes, ...groupNodes],
        filteredLinks: [...relationLinks, ...groupLinks],
      };
    };

    const buildTagView = (targetTagNames: string[]) => {
      if (targetTagNames.length === 0) {
        return { filteredNodes: [] as GraphNode[], filteredLinks: [] as GraphLink[] };
      }

      // 태그 노드 ID 생성 시 중복 방지 보장
      const tagNodeIds = new Set<string>();
      const tagNodes: GraphNode[] = targetTagNames.map((tagName) => {
        // 태그 노드는 'node-tag-' 접두사 사용하여 그룹과 명확히 구분
        const nodeId = `node-tag-${tagName}`;
        if (tagNodeIds.has(nodeId)) {
          // 중복 발생 시 UUID 추가 (이론적으로는 발생하지 않아야 함)
          const uniqueId = `${nodeId}-${uuid.v4()}`;
          tagNodeIds.add(uniqueId);
          return {
            id: uniqueId,
            name: tagName,
            nodeType: 'tag' as const,
            x: Math.random() * width,
            y: Math.random() * height,
          };
        }
        tagNodeIds.add(nodeId);
        return {
          id: nodeId,
          name: tagName,
          nodeType: 'tag' as const,
          x: Math.random() * width,
          y: Math.random() * height,
        };
      });

      const tagNodeMap = new Map(tagNodes.map((node) => [node.name, node]));
      const visiblePersonNodes: GraphNode[] = [];
      const visiblePersonIds = new Set<string>();
      const tagLinks: GraphLink[] = [];
      const tagLinkIds = new Set<string>(); // 링크 ID 중복 방지

      nodes.forEach((personNode) => {
        if (!personNode.personId) return;
        const person = people.find((p) => p.id === personNode.personId);
        if (!person) return;

        const tagProperty = person.properties.find((property) => property.type === 'tags');
        const personTags = tagProperty?.values ?? [];
        // 중복 태그 제거
        const uniquePersonTags = Array.from(new Set(personTags));
        const matchedTags = uniquePersonTags.filter((tagName) => tagNodeMap.has(tagName));

        if (matchedTags.length > 0) {
          visiblePersonNodes.push(personNode);
          visiblePersonIds.add(personNode.id);

          matchedTags.forEach((tagName) => {
            const tagNode = tagNodeMap.get(tagName);
            if (!tagNode) return;

            const linkId = `tag-link-${personNode.id}-${tagNode.id}`;
            // 중복 링크 ID 체크
            if (!tagLinkIds.has(linkId)) {
              tagLinkIds.add(linkId);
              tagLinks.push({
                id: linkId,
                source: personNode,
                target: tagNode,
                type: 'tag',
                strength: 0.3,
              });
            }
          });
        }
      });

      const relationLinks = links.filter(
        (link) => visiblePersonIds.has(link.source.id) && visiblePersonIds.has(link.target.id),
      );

      return {
        filteredNodes: [...visiblePersonNodes, ...tagNodes],
        filteredLinks: [...relationLinks, ...tagLinks],
      };
    };

    if (selectedFilter.type === 'group') {
      const targetGroupNames =
        selectedFilter.value === GROUP_ALL_VALUE
          ? groups
          : selectedFilter.value
            ? [selectedFilter.value]
            : [];
      return buildGroupView(targetGroupNames);
    }

    if (selectedFilter.type === 'tag') {
      const targetTagNames =
        selectedFilter.value === TAG_ALL_VALUE
          ? tags
          : selectedFilter.value
            ? [selectedFilter.value]
            : [];
      return buildTagView(targetTagNames);
    }

    return { filteredNodes: nodes, filteredLinks: links };
  }, [selectedFilter, nodes, links, people, groups, tags, canvasWidth, canvasHeight]);

  const forceRender = useCallback(() => {
    if (__DEV__) {
      console.log('[Graph] forceRender');
    }
    setRenderTick((prev) => prev + 1);
  }, []);
  const { tickSignal, simulationRef, fixNode, unfixNode, updateNodePosition } =
    useGraphLayout(filteredNodes, filteredLinks, canvasWidth, canvasHeight);
  useDerivedValue(() => {
    // tickSignal.value 접근을 통해 시뮬레이션 틱마다 React 리렌더 트리거
    if (tickSignal?.value !== undefined) {
      runOnJS(forceRender)();
    }
  }, [tickSignal, forceRender]);

  const handleNodePress = useCallback((nodeId: string) => {
    Alert.alert('노드 클릭', `노드 ID: ${nodeId}`);
  }, []);

  const handleEdgePress = useCallback((linkId: string) => {
    Alert.alert('엣지 클릭', `엣지 ID: ${linkId}`);
  }, []);

  // 터치 위치에서 가장 가까운 노드 찾기 (worklet)
  const findNodeAtPosition = (x: number, y: number, nodeList: GraphNode[]): string | null => {
    for (let i = 0; i < nodeList.length; i++) {
      const node = nodeList[i];
      const distance = Math.sqrt(
        Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)
      );
      if (distance <= NODE_HIT_RADIUS) {
        return node.id;
      }
    }
    return null;
  };

  // 터치 위치에서 가장 가까운 엣지 찾기 (worklet)
  const findEdgeAtPosition = (x: number, y: number, linkList: GraphLink[]): string | null => {
    for (let i = 0; i < linkList.length; i++) {
      const link = linkList[i];
      const dx = link.target.x - link.source.x;
      const dy = link.target.y - link.source.y;
      const distToLine = Math.abs(
        (dy * x - dx * y + link.target.x * link.source.y - link.target.y * link.source.x) /
        Math.sqrt(dx * dx + dy * dy)
      );
      
      if (distToLine < EDGE_TOUCH_WIDTH) {
        // 엣지의 시작점과 끝점 사이에 있는지 확인
        const dotProduct = (x - link.source.x) * dx + (y - link.source.y) * dy;
        const squaredLength = dx * dx + dy * dy;
        if (dotProduct >= 0 && dotProduct <= squaredLength) {
          return link.id;
        }
      }
    }
    return null;
  };

  const updateCanvasOffset = useCallback(() => {
    requestAnimationFrame(() => {
      canvasContainerRef.current?.measure((_, __, ___, ____, pageX, pageY) => {
        canvasOffsetX.value = pageX;
        canvasOffsetY.value = pageY;
      });
    });
  }, [canvasOffsetX, canvasOffsetY]);

  useEffect(() => {
    updateCanvasOffset();
  }, [updateCanvasOffset]);

  const convertToLocal = useCallback(
    (absoluteX: number, absoluteY: number) => {
      return {
        x: absoluteX - canvasOffsetX.value,
        y: absoluteY - canvasOffsetY.value,
      };
    },
    [canvasOffsetX, canvasOffsetY],
  );

  const getSimNodes = () => simulationRef.current?.nodes() ?? [];
  const getSimLinks = () => {
    const linkForce = simulationRef.current?.force(
      'link',
    ) as ForceLink<GraphNode, GraphLink> | undefined;
    return linkForce?.links() ?? [];
  };

  const handleNodeSelect = useCallback((nodeId: string | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  const connectedLinkIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>();
    }
    return new Set(
      filteredLinks
        .filter(
          (link) =>
            link.source.id === selectedNodeId || link.target.id === selectedNodeId,
        )
        .map((link) => link.id),
    );
  }, [selectedNodeId, filteredLinks]);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>();
    }
    const ids = new Set<string>([selectedNodeId]);
    filteredLinks.forEach((link) => {
      if (link.source.id === selectedNodeId) {
        ids.add(link.target.id);
      } else if (link.target.id === selectedNodeId) {
        ids.add(link.source.id);
      }
    });
    return ids;
  }, [selectedNodeId, filteredLinks]);

  const isSelectionActive = !!selectedNodeId;

  const panGesture = Gesture.Pan()
    .activeOffsetX([-1, 1])
    .activeOffsetY([-1, 1])
    .minDistance(0)
    .runOnJS(true) // <-- Reanimated + JS 콜 많이 쓰면 넣어주는게 안전함
    .shouldCancelWhenOutside(false) // 뷰 밖으로 나가도 cancel 안 되게
    .onStart((e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      const { x: localX, y: localY } = convertToLocal(
        e.absoluteX,
        e.absoluteY,
      );
      touchStartX.value = localX;
      touchStartY.value = localY;
      touchStartTimestamp.value = Date.now();
      isDragging.value = false;
      draggedNodeId.value = null;

      const currentNodes = getSimNodes();
      if (!currentNodes) return;

      const nodeId = findNodeAtPosition(localX, localY, currentNodes);
      if (nodeId) {
        draggedNodeId.value = nodeId;
        runOnJS(fixNode)(nodeId);
        runOnJS(handleNodeSelect)(nodeId);
      } else {
        runOnJS(handleNodeSelect)(null);
      }
    })
    .onUpdate((e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      const { x: localX, y: localY } = convertToLocal(
        e.absoluteX,
        e.absoluteY,
      );
    const distance = Math.sqrt(
      Math.pow(localX - touchStartX.value, 2) +
      Math.pow(localY - touchStartY.value, 2)
    );

    if (distance > TAP_THRESHOLD && !isDragging.value) {
      isDragging.value = true;
    }

    if (draggedNodeId.value) {
      runOnJS(updateNodePosition)(draggedNodeId.value, localX, localY);
    }
  })
    .onFinalize(
      (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        const { x: localX, y: localY } = convertToLocal(
          e.absoluteX,
          e.absoluteY,
        );

    const distance = Math.sqrt(
      Math.pow(localX - touchStartX.value, 2) +
      Math.pow(localY - touchStartY.value, 2)
    );
    const timeElapsed = Date.now() - touchStartTimestamp.value;

        if (draggedNodeId.value) {
          runOnJS(unfixNode)(draggedNodeId.value);
        }

    // 탭 판정
    if (!isDragging.value && distance < TAP_THRESHOLD && timeElapsed < TAP_TIME_THRESHOLD) {
      const currentNodes = getSimNodes();
      const currentLinks = getSimLinks();

      const nodeId = currentNodes
        ? findNodeAtPosition(localX, localY, currentNodes)
        : null;
      if (nodeId) {
        runOnJS(handleNodePress)(nodeId);
      } else {
        const linkId = currentLinks
          ? findEdgeAtPosition(localX, localY, currentLinks)
          : null;
        if (linkId) {
          runOnJS(handleEdgePress)(linkId);
        }
      }
    }

        isDragging.value = false;
        draggedNodeId.value = null;
        runOnJS(handleNodeSelect)(null);
      },
    );

  return (
    <Background isTabBarGap={true}>
      <ScreenHeader
        title="그래프"
        rightContent={
          <FilterDropdown
            groups={groups}
            tags={tags}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        }
      />
      <View className="flex-1 justify-center items-center overflow-visible">
        <View
          ref={canvasContainerRef}
          style={{ width: canvasWidth, height: canvasHeight }}
          onLayout={updateCanvasOffset}
        >
          {Platform.OS === 'ios' ? (
<>
 {/* 터치 전용 레이어 */}
 <GestureDetector gesture={panGesture}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
          </GestureDetector>

          {/* 렌더링 전용 레이어 */}
          <Canvas style={[StyleSheet.absoluteFill]} pointerEvents="none">
            <Group>
              {filteredLinks.map((l) => {
                const isHighlighted = connectedLinkIds.has(l.id);
                const edgeOpacity = isSelectionActive
                  ? isHighlighted
                    ? 1
                    : DIMMED_OPACITY
                  : 1;
                return (
                  <Edge 
                    key={l.id}
                    link={l}
                    isHighlighted={isHighlighted}
                    opacity={edgeOpacity}
                  />
                );
              })}
              {filteredNodes.map((n) => {
                const nodeOpacity = isSelectionActive
                  ? connectedNodeIds.has(n.id)
                    ? 1
                    : DIMMED_OPACITY
                  : 1;
                return (
                  <Node
                    key={n.id}
                    node={n}
                    opacity={nodeOpacity}
                  />
                );
              })}
            </Group>
          </Canvas>
</>

          ):
          (
<>
 {/* 터치 전용 레이어 */}
 <GestureDetector gesture={panGesture}>

          {/* 렌더링 전용 레이어 */}
          <Canvas style={[StyleSheet.absoluteFill]} pointerEvents="none">
            <Group>
              {filteredLinks.map((l) => {
                const isHighlighted = connectedLinkIds.has(l.id);
                const edgeOpacity = isSelectionActive
                  ? isHighlighted
                    ? 1
                    : DIMMED_OPACITY
                  : 1;
                return (
                  <Edge 
                    key={l.id}
                    link={l}
                    isHighlighted={isHighlighted}
                    opacity={edgeOpacity}
                  />
                );
              })}
              {filteredNodes.map((n) => {
                const nodeOpacity = isSelectionActive
                  ? connectedNodeIds.has(n.id)
                    ? 1
                    : DIMMED_OPACITY
                  : 1;
                return (
                  <Node
                    key={n.id}
                    node={n}
                    opacity={nodeOpacity}
                  />
                );
              })}
            </Group>
          </Canvas>
          </GestureDetector>

</>
          )}
         
        </View>
      </View>
      <TabBar />
    </Background>
  );
};
