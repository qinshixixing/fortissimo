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
  return <Operation.List {...props} list={list} type={'link'} />;
}
