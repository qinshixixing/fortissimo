import React from 'react';

import { List } from '../index';
import type { VideoConfig, VideoValue } from '../index';

export interface VideoProps extends VideoConfig {
  value?: VideoValue;
}

export function Item(props: VideoProps) {
  return <List {...props} value={props.value ? [props.value] : []} />;
}
