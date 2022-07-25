import React, { useCallback, useMemo, useState } from 'react';
import { Select } from 'antd';
import { useMount } from '@fortissimo/hook';
import type { RecordData, ValueType } from '../../index';
import type { SelectDataConfig } from '../index';

export interface SelectDataItemProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  value?: ValueType<T> | ValueType<T>[];
  onChange?: (value: ValueType<T>, item?: any) => void;
}

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

export function Item(props: SelectDataItemProps) {
  const itemKey = useMemo(() => props.itemKey || 'key', [props.itemKey]);
  const itemText = useMemo(() => props.itemText || 'text', [props.itemText]);

  const [list, setList] = useState<RecordData[]>([]);
  const getList = useCallback(
    async (value?: string) => {
      const data = await props.onGetData(value);
      if (currentValue === value) setList(data);
    },
    [props]
  );

  const onSearch = useCallback(
    async (value: string) => {
      if (!props.showSearch || !props.searchFromServer) return;
      if (!value) setList([]);
      else {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        currentValue = value;
        timeout = setTimeout(() => {
          getList(value);
        }, 300);
      }
    },
    [props.showSearch, props.searchFromServer, getList]
  );

  useMount(async () => {
    if (props.showSearch && props.searchFromServer) return;
    await getList();
  });

  return (
    <Select
      {...props}
      placeholder={props.placeholder || '请选择'}
      optionFilterProp={'label'}
      options={list.map((item) => ({
        label: item[itemText],
        value: item[itemKey]
      }))}
      onSearch={onSearch}
    />
  );
}
