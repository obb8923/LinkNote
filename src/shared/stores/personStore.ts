import { create } from 'zustand';
import { PersonType, PropertyType } from '@/shared/types/personType';
import { AsyncStorageService } from '@services/asyncStorageService';
import { STORAGE_KEYS } from '@constants/STORAGE_KEYS';
import uuid from 'react-native-uuid';
import { useGraphStore } from '@stores/graphStore';
import { useRelationStore } from '@stores/relationStore';
import { GraphNode } from '@/shared/types/graphType';

// 한글, 영어, 숫자, 특수문자 순으로 정렬하는 함수
const sortPeopleByName = (people: PersonType[]): PersonType[] => {
  return [...people].sort((a, b) => {
    const nameA = a.name.trim();
    const nameB = b.name.trim();
    
    // 빈 문자열 처리
    if (!nameA && !nameB) return 0;
    if (!nameA) return 1;
    if (!nameB) return -1;
    
    const firstCharA = nameA[0];
    const firstCharB = nameB[0];
    
    // 문자 타입에 따른 우선순위 결정
    const getCharPriority = (char: string): number => {
      const code = char.charCodeAt(0);
      
      // 한글 (가-힣): 0xAC00 ~ 0xD7A3
      if (code >= 0xac00 && code <= 0xd7a3) {
        return 0;
      }
      // 영어 대문자 (A-Z): 0x41 ~ 0x5A
      if (code >= 0x41 && code <= 0x5a) {
        return 1;
      }
      // 영어 소문자 (a-z): 0x61 ~ 0x7A
      if (code >= 0x61 && code <= 0x7a) {
        return 1;
      }
      // 숫자 (0-9): 0x30 ~ 0x39
      if (code >= 0x30 && code <= 0x39) {
        return 2;
      }
      // 특수문자 및 기타
      return 3;
    };
    
    const priorityA = getCharPriority(firstCharA);
    const priorityB = getCharPriority(firstCharB);
    
    // 우선순위가 다르면 우선순위로 정렬
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // 같은 우선순위 내에서는 일반적인 문자열 정렬
    return nameA.localeCompare(nameB, 'ko', { sensitivity: 'base' });
  });
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

interface PersonStore {
  people: PersonType[];
  setPeople: (people: PersonType[]) => void;
  addPerson: (person: Omit<PersonType, 'id'>) => Promise<void>;
  updatePerson: (personId: string, updates: Partial<PersonType>) => Promise<void>;
  deletePerson: (personId: string) => Promise<void>;
}

export const usePersonStore = create<PersonStore>((set, get) => ({
  people: [],

  setPeople: (people: PersonType[]) => {
    set({ people });
  },

  addPerson: async (personData: Omit<PersonType, 'id'>) => {
    const newPerson: PersonType = {
      id: uuid.v4() as string,
      name: personData.name,
      properties: personData.properties || createDefaultProperties(),
      memo: personData.memo || '',
    };

    const updatedPeople = [...get().people, newPerson];
    const sortedPeople = sortPeopleByName(updatedPeople);
    set({ people: sortedPeople });

    // AsyncStorage에 정렬된 배열 저장
    await AsyncStorageService.setJSONItem<PersonType[]>(
      STORAGE_KEYS.PEOPLE,
      sortedPeople,
    );

    // graphStore에도 노드 추가
    const newNode: GraphNode = {
      id: newPerson.id,
      personId: newPerson.id,
      name: newPerson.name,
      nodeType: 'person' as const,
      x: Math.random() * 400,
      y: Math.random() * 600,
    };
    useGraphStore.getState().addNode(newNode);
  },

  updatePerson: async (personId: string, updates: Partial<PersonType>) => {
    const updatedPeople = get().people.map((person) => {
      if (person.id === personId) {
        return { ...person, ...updates };
      }
      return person;
    });

    const sortedPeople = sortPeopleByName(updatedPeople);
    set({ people: sortedPeople });

    // AsyncStorage에 정렬된 배열 저장
    await AsyncStorageService.setJSONItem<PersonType[]>(
      STORAGE_KEYS.PEOPLE,
      sortedPeople,
    );
  },

  deletePerson: async (personId: string) => {
    const remainingPeople = get().people.filter((person) => person.id !== personId);
    const sortedPeople = sortPeopleByName(remainingPeople);
    set({ people: sortedPeople });

    await AsyncStorageService.setJSONItem<PersonType[]>(
      STORAGE_KEYS.PEOPLE,
      sortedPeople,
    );

    const graphNodes = useGraphStore.getState().nodes;
    const graphLinks = useGraphStore.getState().links;
    const filteredNodes = graphNodes.filter((node) => node.personId !== personId);
    const filteredLinks = graphLinks.filter(
      (link) =>
        link.source.personId !== personId && link.target.personId !== personId,
    );
    useGraphStore.getState().setNodes(filteredNodes);
    useGraphStore.getState().setLinks(filteredLinks);

    const relationStore = useRelationStore.getState();
    const filteredRelations = relationStore.relations.filter(
      (relation) =>
        relation.sourcePersonId !== personId &&
        relation.targetPersonId !== personId,
    );
    relationStore.setRelations(filteredRelations);

    await AsyncStorageService.setJSONItem(
      STORAGE_KEYS.RELATIONS,
      filteredRelations,
    );
  },
}));

