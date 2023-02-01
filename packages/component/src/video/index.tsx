import type { ReactNode } from 'react';
import type { UploadData } from '../index';

export interface VideoValue {
  url: UploadData;
  cover?: UploadData;
  duration?: number | string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}

export interface VideoConfig {
  width?: number | string;
  height?: number | string;
  empty?: ReactNode;
}

export { Item } from './item';
export type { VideoProps } from './item';

export { List } from './list';
export type { VideoListProps } from './list';
