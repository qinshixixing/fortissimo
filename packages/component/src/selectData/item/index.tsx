import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useMount } from '@fortissimo/hook';
import type { RecordData, ValueType } from '../../index';
import type { SelectDataConfig } from '../index';

export interface SelectDataItemProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  value?: SelectProps<ValueType<T>, T>['value'];
  onChange?: (
    value: SelectProps<ValueType<T>, T>['value'],
    option: T | T[]
  ) => void;
}

export const Item = forwardRef((props: SelectDataItemProps, ref) => {
  const currentValue = useRef<string>('');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [list, setList] = useState<RecordData[]>([]);

  const getList = useCallback(
    async (searchValue?: string) => {
      if (!props.onGetData) return;
      const data = await props.onGetData(searchValue);
      if (
        !props.showSearch ||
        !props.searchFromServer ||
        currentValue.current === searchValue
      )
        setList(data);
    },
    [props]
  );

  const onSearch = useCallback(
    async (searchValue: string) => {
      if (!props.showSearch || !props.searchFromServer) return;
      if (!searchValue) setList([]);
      else {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        currentValue.current = searchValue;
        timeout.current = setTimeout(() => {
          getList(searchValue);
        }, 300);
      }
    },
    [props.showSearch, props.searchFromServer, getList]
  );

  useImperativeHandle(ref, () => ({
    getList: () => list,
    setList
  }));

  useMount(async () => {
    if (props.showSearch && props.searchFromServer) return;
    await getList();
  });

  return (
    <Select
      {...props}
      placeholder={props.placeholder || '请选择'}
      optionFilterProp={'label'}
      filterOption={!props.showSearch || !props.searchFromServer}
      options={list.map((item) => ({
        label: item[props.itemText || 'text'],
        value: item[props.itemKey || 'key'],
        itemData: item
      }))}
      onChange={(value, item) => {
        props.onChange &&
          props.onChange(
            value,
            Array.isArray(item)
              ? item.map((item) => item.itemData)
              : item.itemData
          );
      }}
      onSearch={props.showSearch ? onSearch : undefined}
    />
  );
});
