import React from 'react';

import { List } from '../index';

import type { UploadData } from '../../index';
import type { PicConfig } from '../index';

export interface PicProps extends PicConfig {
  value?: UploadData;
}

export function Item(props: PicProps) {
  return <List {...props} value={props.value ? [props.value] : []} />;
}
