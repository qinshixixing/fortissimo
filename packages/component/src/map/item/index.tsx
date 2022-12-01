import React from 'react';

import { List } from '../index';

import type { MapPointConfig, MapValue } from '../index';

export interface MapItemProps extends MapPointConfig {
  value?: Partial<MapValue>;
}

export function Item(props: MapItemProps) {
  return <List {...props} value={props.value ? [props.value] : []} />;
}
