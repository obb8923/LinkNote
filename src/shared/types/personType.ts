export type PropertyValues =
  | 'tags'
  | 'organizations'
  | 'phone'
  | 'birthday'
  | 'likes'
  | 'dislikes'
  | 'personality';

export interface PropertyType {
  id: string;
  type: PropertyValues;
  values: string[];
}

export type PersonType = {
  id: string;
  name: string;
  properties: PropertyType[];
  memo: string;
};

