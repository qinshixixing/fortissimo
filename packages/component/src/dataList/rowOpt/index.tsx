import React, { useMemo } from 'react';
import { Operation } from '../../index';
import type { DataListOptProps } from '../index';

export function RowOpt(props: DataListOptProps) {
  const list = useMemo(
    () =>
      props.list &&
      props.list.map((item) => ({
        ...item,
        className: 'ft-data-list-row-opt-item'
      })),
    [props.list]
  );
  return (
    <Operation.List
      {...props}
      className={'ft-data-list-row-opt'}
      emptyText={typeof props.emptyText === 'string' ? props.emptyText : '-'}
      list={list}
      type={'link'}
    />
  );
}
