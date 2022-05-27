import React, { useCallback, useMemo, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import type { RecordData, KeyType, ValueType } from '../index';
import { useMount } from '@fortissimo/hook';

export interface SelectDataProps<T extends RecordData = RecordData>
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'onSearch' | 'options' | 'optionFilterProp'
  > {
  itemKey?: KeyType<T>;
  itemText?: KeyType<T>;
  onGetData: (searchValue?: string) => Promise<T[]>;
  value?: ValueType<T>;
  onChange?: (value: ValueType<T>) => void;
  searchFromServer?: boolean;
}

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

export function SelectData(props: SelectDataProps) {
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
        timeout = setTimeout(getList, 400);
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
      optionFilterProp={'label'}
      options={list.map((item) => ({
        label: item[itemText],
        value: item[itemKey]
      }))}
      onSearch={onSearch}
    />
  );
}
