import React, { useCallback, useMemo, useState } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useMount } from '@fortissimo/hook';
import type { RecordData, ValueType, KeyType } from '../../index';
import type { SelectDataConfig } from '../index';

export interface SelectDataLinkProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  itemChildren?: KeyType<T>;
  value?: [ValueType<T>, ValueType<T>];
  onChange?: (value: [ValueType<T>, ValueType<T>]) => void;
}

let timeout: ReturnType<typeof setTimeout> | null;
const currentValue: [string, string] = ['', ''];

export function Link(props: SelectDataLinkProps) {
  const itemKey = useMemo(() => props.itemKey || 'key', [props.itemKey]);
  const itemText = useMemo(() => props.itemText || 'text', [props.itemText]);
  const itemChildren = useMemo(
    () => props.itemChildren || 'children',
    [props.itemChildren]
  );

  const [list, setList] = useState<RecordData[]>([]);
  const [childList, setChildList] = useState<RecordData[]>([]);

  const getList = useCallback(
    async (value?: string, isFirst?: boolean) => {
      if (isFirst) {
        const data = await props.onGetData(value);
        if (currentValue[0] === value) setList(data);
      } else {
        if (!props.value || !props.value[0]) return;
        const data = await props.onGetData(value, props.value[0]);
        if (currentValue[1] === value) setChildList(data);
      }
    },
    [props]
  );

  const onSearch = useCallback(
    async (value: string, isFirst: boolean) => {
      if (!props.showSearch || !props.searchFromServer) return;
      const handle = isFirst ? setList : setChildList;
      if (!value) handle([]);
      else if (!isFirst && (!props.value || !props.value[0])) handle([]);
      else {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        currentValue[isFirst ? 0 : 1] = value;
        timeout = setTimeout(async () => {
          await getList(value, isFirst);
        }, 300);
      }
    },
    [props.showSearch, props.searchFromServer, getList, props.value]
  );

  useMount(async () => {
    if (props.showSearch && props.searchFromServer) return;
    await getList();
  });

  const selectConfig: SelectProps = {
    className: 'ft-select-data-link',
    style: { width: 200, ...(props.style || {}) },
    placeholder: props.placeholder || '请选择',
    optionFilterProp: 'label'
  };

  return (
    <>
      <Select
        {...props}
        {...selectConfig}
        options={list.map((item) => ({
          label: item[itemText],
          value: item[itemKey]
        }))}
        onSearch={async (value) => {
          await onSearch(value, true);
        }}
        onChange={(value) => {
          if ((!props.showSearch || !props.searchFromServer) && props.value) {
            const result = list.find((item) =>
              props.value ? item[itemKey] === props.value[0] : false
            );
            setChildList(result ? result[itemChildren] : []);
          } else setChildList([]);
          props.onChange && props.onChange([value, undefined]);
        }}
      />
      <Select
        {...props}
        {...selectConfig}
        options={childList.map((item) => ({
          label: item[itemText],
          value: item[itemKey]
        }))}
        onSearch={async (value) => {
          await onSearch(value, false);
        }}
        onChange={(value) => {
          props.onChange &&
            props.onChange([props.value ? props.value[0] : undefined, value]);
        }}
      />
    </>
  );
}
