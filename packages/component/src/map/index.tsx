import type { ReactNode } from 'react';

export * as Amap from '@amap/amap-react';

interface Location {
  coordinate: [number, number];
  longitude: number;
  latitude: number;
}

interface Area {
  province: string;
  provinceCode: string;
  city: string;
  cityCode: string;
  district: string;
  districtCode: string;
}

export interface MapValue extends Location, Area {
  text: string;
  tip?: string;
}

export interface MapConfig {
  headerTip?: string;
  zoom?: number;
  width?: number | string;
  height?: number | string;
  icon?: string;
  showText?: boolean;
  showTip?: boolean;
}

export interface MapPointConfig extends MapConfig {
  children?: ReactNode;
  render?: (data?: Partial<MapValue>) => ReactNode;
  tipRender?: (data?: Partial<MapValue>) => ReactNode;
}

export { List } from './list';
export type { MapListProps } from './list';

export { Item } from './item';
export type { MapItemProps } from './item';

export { Line } from './line';
export type { MapLineProps } from './line';

export { Circle } from './circle';
export type { MapCircleValue, MapCircleProps } from './circle';
