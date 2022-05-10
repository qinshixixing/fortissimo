import React from 'react';

import { List } from '../index';

import type { PicConfig } from '../index';

export interface PicProps extends PicConfig {
  value?: string;
}

export function Item(props: PicProps) {
  return <List {...props} value={props.value ? [props.value] : []} />;
}
