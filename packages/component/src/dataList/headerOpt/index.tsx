import React from 'react';
import { Operation } from '../../index';
import type { DataListOptProps } from '../index';

export function HeaderOpt<K extends string = string, T = any>(
  props: DataListOptProps<K, T>
) {
  return <Operation.List {...props} type={'primary'} />;
}
