import { create } from 'zustand';
import { AsyncStorageService } from '@services/asyncStorageService';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import { PersonType, PropertyType } from '@/shared/types/personType';
import { Relation } from '@/shared/types/relationType';
import { GraphNode, GraphLink } from '@/shared/types/graphType';
import { usePersonStore } from './personStore';
import { useGraphStore } from './graphStore';
import { useRelationStore } from './relationStore';
import uuid from 'react-native-uuid';
import {
  DEV_MOCK_PEOPLE,
  DEV_MOCK_RELATIONS,
  ENABLE_DEV_DATA_MOCK,
} from '@constants/MOCK';

// 기존 Person 타입 (마이그레이션용)
type OldPerson = {
  id: string;
  name: string;
  phone?: string;
  description?: string;
  properties?: PropertyType[];
  memo?: string;
};

const createDefaultProperties = (): PropertyType[] => {
  return [
    {
      id: uuid.v4() as string,
      type: 'tags',
      values: [],
    },
    {
      id: uuid.v4() as string,
      type: 'organizations',
      values: [],
    },
  ];
};

// 기존 데이터를 새로운 형식으로 마이그레이션
const migratePerson = (oldPerson: OldPerson): PersonType => {
  // 이미 새로운 형식인 경우 그대로 반환
  if (oldPerson.properties !== undefined && oldPerson.memo !== undefined) {
    return oldPerson as PersonType;
  }

  // 기존 형식인 경우 마이그레이션
  const properties = createDefaultProperties();
  
  // phone이 있으면 phone property 추가
  if (oldPerson.phone) {
    properties.push({
      id: uuid.v4() as string,
      type: 'phone',
      values: [oldPerson.phone],
    });
  }

  return {
    id: oldPerson.id,
    name: oldPerson.name,
    properties,
    memo: oldPerson.description || oldPerson.memo || '',
  };
};

interface InitStore {
  isInitialized: boolean;
  initialize: () => Promise<void>;
}

export const useInitStore = create<InitStore>((set) => ({
  isInitialized: false,

  initialize: async () => {
    try {
      // AsyncStorage에서 지인 정보 불러오기
      const oldPeople = await AsyncStorageService.getJSONItem<OldPerson[]>(
        STORAGE_KEYS.PEOPLE,
      );

      // 기존 데이터를 새로운 형식으로 마이그레이션
      let migratedPeople = (oldPeople || []).map(migratePerson);

      // 마이그레이션이 발생한 경우 저장
      if (oldPeople && oldPeople.length > 0) {
        const needsMigration = oldPeople.some(
          (p) => p.properties === undefined || p.memo === undefined
        );
        
        if (needsMigration) {
          await AsyncStorageService.setJSONItem<PersonType[]>(
            STORAGE_KEYS.PEOPLE,
            migratedPeople,
          );
        }
      }

      if (__DEV__ && ENABLE_DEV_DATA_MOCK) {
        migratedPeople = DEV_MOCK_PEOPLE;
      }

      // personStore에 설정 (이미 정렬된 값이 저장되어 있음)
      usePersonStore.getState().setPeople(migratedPeople);

      // graphStore에 노드 동기화
      let nodes: GraphNode[] = [];
      if (migratedPeople.length > 0) {
        nodes = migratedPeople.map((person) => ({
          id: person.id,
          personId: person.id,
          name: person.name,
          nodeType: 'person' as const,
          x: Math.random() * 400,
          y: Math.random() * 600,
        }));
        useGraphStore.getState().setNodes(nodes);
      } else {
        useGraphStore.getState().setNodes([]);
      }

      // AsyncStorage에서 관계 정보 불러오기
      const storedRelations =
        await AsyncStorageService.getJSONItem<Relation[]>(
          STORAGE_KEYS.RELATIONS,
        );

      let relationData = storedRelations || [];
      if (__DEV__ && ENABLE_DEV_DATA_MOCK) {
        relationData = DEV_MOCK_RELATIONS;
      }

      let links: GraphLink[] = [];
      if (relationData.length > 0) {
        // relationStore에 설정
        useRelationStore.getState().setRelations(relationData);

        // graphStore에 링크 동기화
        links = relationData
          .map((relation) => {
            const sourceNode = nodes.find(
              (n) => n.personId === relation.sourcePersonId,
            );
            const targetNode = nodes.find(
              (n) => n.personId === relation.targetPersonId,
            );

            if (!sourceNode || !targetNode) {
              return null;
            }

            return {
              id: relation.id,
              source: sourceNode,
              target: targetNode,
              type: relation.description,
              strength: relation.strength as number,
            };
          })
          .filter((link): link is GraphLink => link !== null);

        useGraphStore.getState().setLinks(links);
      } else {
        // 관계 정보가 없으면 빈 배열로 설정
        useRelationStore.getState().setRelations([]);
        useGraphStore.getState().setLinks([]);
      }

      set({ isInitialized: true });
    } catch (error) {
      console.error('초기화 중 오류 발생:', error);
      // 오류 발생 시 빈 배열로 설정
      usePersonStore.getState().setPeople([]);
      useGraphStore.getState().setNodes([]);
      useGraphStore.getState().setLinks([]);
      useRelationStore.getState().setRelations([]);
      set({ isInitialized: true });
    }
  },
}));

