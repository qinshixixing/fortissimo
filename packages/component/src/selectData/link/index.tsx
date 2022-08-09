import React, {
  useCallback,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import { useMount } from '@fortissimo/hook';
import type { RecordData, ValueType, KeyType } from '../../index';
import type { SelectDataConfig } from '../index';

export interface SelectDataLinkProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  itemChildren?: KeyType<T>;
  value?: [ValueType<T>, ValueType<T>];
  onChange?: (value: [ValueType<T>, ValueType<T>], item?: [any, any]) => void;
}

let timeout: ReturnType<typeof setTimeout> | null;

export const Link = forwardRef((props: SelectDataLinkProps, ref) => {
  const itemKey = useMemo(() => props.itemKey || 'key', [props.itemKey]);
  const itemText = useMemo(() => props.itemText || 'text', [props.itemText]);
  const currentValue = useRef<[string, string]>(['', '']);
  const itemChildren = useMemo(
    () => props.itemChildren || 'children',
    [props.itemChildren]
  );

  const [list, setList] = useState<RecordData[]>([]);
  const [childList, setChildList] = useState<RecordData[]>([]);

  const showChildList = useMemo<RecordData[]>(() => {
    if (props.showSearch && props.searchFromServer) return childList;
    const result = list.find((item) =>
      props.value ? item[itemKey] === props.value[0] : false
    );
    if (result) return result[itemChildren];
    return [];
  }, [
    props.showSearch,
    props.searchFromServer,
    childList,
    props.value,
    list,
    itemKey,
    itemChildren
  ]);

  const getList = useCallback(
    async (value?: string, isFirst?: boolean) => {
      if (isFirst) {
        const data = await props.onGetData(value);
        if (currentValue.current[0] === value) setList(data);
      } else {
        if (!props.value || !props.value[0]) return;
        const data = await props.onGetData(value, props.value[0]);
        if (currentValue.current[1] === value) setChildList(data);
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
        currentValue.current[isFirst ? 0 : 1] = value;
        timeout = setTimeout(async () => {
          await getList(value, isFirst);
        }, 300);
      }
    },
    [props.showSearch, props.searchFromServer, getList, props.value]
  );

  useImperativeHandle(ref, () => ({
    setList,
    setChildList
  }));

  useMount(async () => {
    if (
      props.showSearch &&
      props.searchFromServer &&
      !props.searchFromServerWhileEmpty
    )
      return;
    await getList(undefined, true);
  });

  const selectConfig: SelectProps = {
    className: 'ft-select-data-link',
    style: { width: 200, ...(props.style || {}) },
    placeholder: props.placeholder || '请选择',
    optionFilterProp: 'label'
  };

  const [oneLevelData, setOneLevelData] = useState<any>();

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
        value={props.value ? props.value[0] : undefined}
        onChange={(value, item) => {
          setOneLevelData(item);
          props.onChange &&
            props.onChange([value, undefined], [item, undefined]);
          if (props.showSearch && props.searchFromServer) return;
          if (value) {
            const result = list.find((item) => item[itemKey] === value);
            setChildList(result ? result[itemChildren] : []);
          } else setChildList([]);
        }}
      />
      <Select
        {...props}
        {...selectConfig}
        options={showChildList.map((item) => ({
          label: item[itemText],
          value: item[itemKey]
        }))}
        onSearch={async (value) => {
          await onSearch(value, false);
        }}
        value={props.value ? props.value[1] : undefined}
        onChange={(value, item) => {
          props.onChange &&
            props.onChange(
              [props.value ? props.value[0] : undefined, value],
              [props.value ? oneLevelData : undefined, item]
            );
        }}
      />
    </>
  );
});
