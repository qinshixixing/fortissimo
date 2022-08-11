import React from 'react';
import { Operation } from '../../index';
import type { DataListOptProps } from '../index';

export function HeaderOpt(props: DataListOptProps) {
  return (
    <Operation.List
      className={'ft-data-list-header-opt'}
      {...props}
      type={'primary'}
      size={props.size}
    />
  );
}
