import { ReactNode } from 'react';

export interface AudioConfig {
  width?: number | string;
  height?: number | string;
  empty?: ReactNode;
}

export { Item } from './item';
export type { AudioProps } from './item';

export { List } from './list';
export type { AudioListProps } from './list';
