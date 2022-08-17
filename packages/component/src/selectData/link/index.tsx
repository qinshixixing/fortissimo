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
import type { RecordData, ValueType } from '../../index';
import type { SelectDataConfig } from '../index';

export interface SelectDataLinkProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  itemConfig?: SelectDataConfig[];
  itemNum: number;
  value?: SelectProps<ValueType<T>, T>['value'][];
  onChange?: (
    value: SelectProps<ValueType<T>, T>['value'][],
    option: T[] | T[][]
  ) => void;
}

export const Link = forwardRef((props: SelectDataLinkProps, ref) => {
  const currentValue = useRef<string>('');
  const currentItem = useRef<number>(-1);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const numList = useMemo(() => {
    const num = props.itemNum < 0 ? 0 : props.itemNum;
    const data: number[] = [];
    if (num > 0) {
      let i = 0;
      while (i < num) {
        data.push(i);
        i++;
      }
    }
    return data;
  }, [props.itemNum]);

  const itemConfig = useMemo(() => {
    const data = props.itemConfig || [];
    const config: SelectDataConfig[] = numList.map((item) => ({
      ...props,
      ...(data[item] || {})
    }));
    return config;
  }, [numList, props]);

  const valueList = useMemo(() => props.value || [], [props.value]);

  const [list, setList] = useState<RecordData[][]>([]);

  const [selectList, setSelectList] = useState<RecordData[][]>([]);

  const getList = useCallback(
    async (item: number, value?: string) => {
      const config = itemConfig[item];
      const onGetData = config.onGetData;
      if (!onGetData) return;
      const data = await onGetData(value, item);
      if (
        !props.showSearch ||
        !props.searchFromServer ||
        (currentValue.current === value && currentItem.current === item)
      ) {
        const newList = list.map((v, index) => {
          if (index < item) return v;
          if (index === item) return data;
          return [];
        });
        setList(newList);
      }
    },
    [itemConfig, list, props.searchFromServer, props.showSearch]
  );

  const onSearch = useCallback(
    async (item: number, value: string) => {
      const config = itemConfig[item];
      if (!config.showSearch || !config.searchFromServer) return;
      if (!value) {
        const newList = list.map((v, index) => {
          if (index < item) return v;
          return [];
        });
        setList(newList);
      } else {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        currentValue.current = value;
        currentItem.current = item;
        timeout.current = setTimeout(() => {
          getList(item, value);
        }, 300);
      }
    },
    [itemConfig, list, getList]
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
    await getList(0);
  });

  return (
    <>
      {numList.map((item) => {
        const config = itemConfig[item];
        const itemList = list[item] || [];

        return (
          <Select
            key={item}
            {...config}
            className={
              'ft-select-data-link' +
              (config.className ? ` ${config.className}` : '')
            }
            style={{
              width: 200,
              ...(config.style || {})
            }}
            placeholder={props.placeholder || '请选择'}
            optionFilterProp={'label'}
            options={itemList.map((item) => ({
              label: item[config.itemText || 'text'],
              value: item[config.itemText || 'key'],
              itemData: item
            }))}
            value={valueList[item]}
            onChange={async (valueData, itemData) => {
              if (!props.onChange) return;
              const newValue = valueList.map((v, index) => {
                if (index < item) return v;
                if (index === item) return valueData;
                return undefined;
              });
              const newSelectList = selectList.map((v, index) => {
                if (index < item) return v;
                if (index === item)
                  return Array.isArray(itemData)
                    ? itemData.map((item) => item.itemData)
                    : itemData.itemData;
                return undefined;
              });
              setSelectList(newSelectList);
              props.onChange(newValue, newSelectList);
              if (props.onGetData && item < numList.length - 1) {
                if (config.hasChildren) {
                  const data = Array.isArray(itemData) ? itemData : [itemData];
                  const dataList: RecordData[] = [];
                  data.forEach((item) => {
                    dataList.concat(
                      item.itemData[config.itemChildren || 'children']
                    );
                  });
                  const newList = list.map((v, index) => {
                    if (index < item) return v;
                    if (index === item) return dataList;
                    return [];
                  });
                  setList(newList);
                } else await getList(item + 1);
              }
            }}
            onSearch={
              config.showSearch
                ? async (value) => {
                    await onSearch(item, value);
                  }
                : undefined
            }
          />
        );
      })}
    </>
  );
});
