import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GraphNode, GraphLink } from '@/shared/types/graphType';

interface GraphStore {
  nodes: GraphNode[];
  links: GraphLink[];
  addNode: (node: GraphNode) => void;
  addLink: (link: GraphLink) => void;
  setNodes: (nodes: GraphNode[]) => void;
  setLinks: (links: GraphLink[]) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
}

export const useGraphStore = create<GraphStore>()(
  persist(
    (set, get) => ({
      nodes: [],
      links: [],
      addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),
      addLink: (link) => set((s) => ({ links: [...s.links, link] })),
      setNodes: (nodes) => set({ nodes }),
      setLinks: (links) => set({ links }),
      updateNodePosition: (nodeId, x, y) =>
        set((s) => ({
          nodes: s.nodes.map((n) =>
            n.id === nodeId ? { ...n, x, y, vx: 0, vy: 0 } : n
          ),
        })),
    }),
    { name: 'graph-data' },
  ),
);

