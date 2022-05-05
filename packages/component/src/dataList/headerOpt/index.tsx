import React from 'react';
import { Operation } from '../../index';
import type { DataListOptProps } from '../index';

export function HeaderOpt(props: DataListOptProps) {
  return <Operation.List {...props} type={'primary'} />;
}
