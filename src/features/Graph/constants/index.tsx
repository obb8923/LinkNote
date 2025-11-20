export const NODE_RADIUS = 6;
export type GraphForcePresetType = {
    CHARGE: {
      STRENGTH: number;
      DISTANCE_MIN: number;
      DISTANCE_MAX: number;
      THETA: number;
    };
  
    LINK: {
      DISTANCE: number;
      STRENGTH: number;
      ITERATIONS: number;
    };
  
    CENTER: {
      STRENGTH: number;
    };
  
    COLLIDE: {
      RADIUS_MULTIPLIER: number;
      STRENGTH: number;
      ITERATIONS: number;
    };
  
    SIMULATION: {
      ALPHA_DECAY: number;
      VELOCITY_DECAY: number;
      ALPHA_MIN: number;
    };
  };
  

export const FORCE_PRESET_DEFAULT: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -10, // 노드 간 반발력 강도
      DISTANCE_MIN: 20, // 노드 간 최소 거리
      DISTANCE_MAX: 200, // 노드 간 최대 거리
      THETA: 1, // 노드 간 반발력 강도 조절
    },
  
    LINK: {
      DISTANCE: 90, // 엣지 간 거리
      STRENGTH: 0.1, // 엣지 간 강도
      ITERATIONS: 1, // 엣지 간 반복 횟수
    },
  
    CENTER: {
      STRENGTH: 1, // 중심 강도
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 2.2, // 노드 간 충돌 반경 계수
      STRENGTH: 1, // 노드 간 충돌 강도
      ITERATIONS: 1, // 노드 간 충돌 반복 횟수
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.05, // 시뮬레이션 알파 감소 속도
      VELOCITY_DECAY: 0.3, // 시뮬레이션 속도 감소 속도
      ALPHA_MIN: 0.001, // 시뮬레이션 알파 최소 값
    },
  };
  
  export const FORCE_PRESET_SOFT: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -20,
      DISTANCE_MIN: 10,
      DISTANCE_MAX: 500,
      THETA: 0.7,
    },
  
    LINK: {
      DISTANCE: 120,
      STRENGTH: 0.05,
      ITERATIONS: 1,
    },
  
    CENTER: {
      STRENGTH: 0.5,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 2.0,
      STRENGTH: 0.8,
      ITERATIONS: 1,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.01,
      VELOCITY_DECAY: 0.15,
      ALPHA_MIN: 0.0005,
    },
  };
  
  

  export const FORCE_PRESET_SNAPPY: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -80,
      DISTANCE_MIN: 5,
      DISTANCE_MAX: 200,
      THETA: 1,
    },
  
    LINK: {
      DISTANCE: 70,
      STRENGTH: 0.2,
      ITERATIONS: 2,
    },
  
    CENTER: {
      STRENGTH: 1.5,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 1.8,
      STRENGTH: 1,
      ITERATIONS: 2,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.08,
      VELOCITY_DECAY: 0.35,
      ALPHA_MIN: 0.002,
    },
  };
  

  export const FORCE_PRESET_RELAXED: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -5,
      DISTANCE_MIN: 30,
      DISTANCE_MAX: 600,
      THETA: 0.6,
    },
  
    LINK: {
      DISTANCE: 140,
      STRENGTH: 0.05,
      ITERATIONS: 1,
    },
  
    CENTER: {
      STRENGTH: 0.2,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 2.5,
      STRENGTH: 0.5,
      ITERATIONS: 1,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.02,
      VELOCITY_DECAY: 0.2,
      ALPHA_MIN: 0.0008,
    },
  };
  
  
  export const FORCE_PRESET_CLUSTERED: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -10,
      DISTANCE_MIN: 10,
      DISTANCE_MAX: 150,
      THETA: 1,
    },
  
    LINK: {
      DISTANCE: 60,
      STRENGTH: 0.3,
      ITERATIONS: 2,
    },
  
    CENTER: {
      STRENGTH: 0.8,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 1.6,
      STRENGTH: 1.2,
      ITERATIONS: 2,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.06,
      VELOCITY_DECAY: 0.22,
      ALPHA_MIN: 0.0015,
    },
  };
  

  export const FORCE_PRESET_SPRINGY: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -50,
      DISTANCE_MIN: 20,
      DISTANCE_MAX: 300,
      THETA: 1,
    },
  
    LINK: {
      DISTANCE: 90,
      STRENGTH: 0.15, 
      ITERATIONS: 2,
    },
  
    CENTER: {
      STRENGTH: 0.4,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 2.2,
      STRENGTH: 1.1,
      ITERATIONS: 1,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.03,
      VELOCITY_DECAY: 0.18,
      ALPHA_MIN: 0.0007,
    },
  };
  

  export const FORCE_PRESET_STATIC: GraphForcePresetType = {
    CHARGE: {
      STRENGTH: -5,
      DISTANCE_MIN: 20,
      DISTANCE_MAX: 100,
      THETA: 1,
    },
  
    LINK: {
      DISTANCE: 80,
      STRENGTH: 0.4,
      ITERATIONS: 3,
    },
  
    CENTER: {
      STRENGTH: 1,
    },
  
    COLLIDE: {
      RADIUS_MULTIPLIER: 1.2,
      STRENGTH: 1.5,
      ITERATIONS: 3,
    },
  
    SIMULATION: {
      ALPHA_DECAY: 0.1,
      VELOCITY_DECAY: 0.4,
      ALPHA_MIN: 0.003,
    },
  };
  

  export const GRAPH_PRESET_ORGANIC = {
    CHARGE: { STRENGTH: -100, DISTANCE_MIN: 20, DISTANCE_MAX: 220 },
    LINK: { DISTANCE: 160, STRENGTH: 0.3 },
    COLLIDE: { RADIUS_MULTIPLIER: 2.2, STRENGTH: 0.4 },
    SIMULATION: { VELOCITY_DECAY: 0.1, ALPHA_DECAY: 0.01 },
  };
  
