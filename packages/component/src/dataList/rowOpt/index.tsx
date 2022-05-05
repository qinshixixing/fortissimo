import React, { useMemo } from 'react';
import { Operation } from '../../index';
import type { DataListOptProps } from '../index';

export function RowOpt<K extends string = string, T = any>(
  props: DataListOptProps<K, T>
) {
  const list = useMemo(
    () =>
      props.list &&
      props.list.map((item) => ({
        ...item,
        className: 'ft-data-list-row-opt-item'
      })),
    [props.list]
  );
  return <Operation.List {...props} list={list} type={'link'} />;
}
