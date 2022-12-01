import React from 'react';

import { List } from '../index';

import type { AudioConfig } from '../index';
import type { UploadData } from '../../index';

export interface AudioProps extends AudioConfig {
  value?: UploadData;
}

export function Item(props: AudioProps) {
  return <List {...props} value={props.value ? [props.value] : []} />;
}
