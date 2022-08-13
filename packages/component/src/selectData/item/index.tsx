import React, {
  useCallback,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import { Select } from 'antd';
import { useMount } from '@fortissimo/hook';
import type { RecordData, ValueType } from '../../index';
import type { SelectDataConfig, SelectDataOptionConfig } from '../index';

export interface SelectDataItemProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  value?: ValueType<T> | ValueType<T>[];
  onChange?: (
    value: ValueType<T>,
    item?: SelectDataOptionConfig | SelectDataOptionConfig[]
  ) => void;
}

let timeout: ReturnType<typeof setTimeout> | null;

export const Item = forwardRef((props: SelectDataItemProps, ref) => {
  const itemKey = useMemo(() => props.itemKey || 'key', [props.itemKey]);
  const itemText = useMemo(() => props.itemText || 'text', [props.itemText]);
  const currentValue = useRef<string>('');

  const [list, setList] = useState<RecordData[]>([]);

  const getList = useCallback(
    async (value?: string) => {
      const data = await props.onGetData(value);
      if (
        !props.showSearch ||
        !props.searchFromServer ||
        currentValue.current === value
      )
        setList(data);
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
        currentValue.current = value;
        timeout = setTimeout(() => {
          getList(value);
        }, 300);
      }
    },
    [props.showSearch, props.searchFromServer, getList]
  );

  useImperativeHandle(ref, () => ({
    setList
  }));

  useMount(async () => {
    if (
      props.showSearch &&
      props.searchFromServer &&
      !props.searchFromServerWhileEmpty
    )
      return;
    await getList();
  });

  return (
    <Select
      {...props}
      placeholder={props.placeholder || '请选择'}
      optionFilterProp={'label'}
      options={list.map((item) => ({
        label: item[itemText],
        value: item[itemKey],
        itemData: item
      }))}
      onSearch={props.showSearch ? onSearch : undefined}
    />
  );
});
