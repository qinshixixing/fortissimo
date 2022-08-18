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
    async (itemIndex: number, parentValue?: any, searchValue?: string) => {
      const config = itemConfig[itemIndex];
      const onGetData = config.onGetData;
      if (!onGetData) return;
      const data = await onGetData(searchValue, itemIndex, parentValue);
      if (
        !props.showSearch ||
        !props.searchFromServer ||
        (currentValue.current === searchValue &&
          currentItem.current === itemIndex)
      ) {
        const newList = list.map((v, index) => {
          if (index < itemIndex) return v;
          return [];
        });
        newList[itemIndex] = data; // 不能放在map中，list可能为空
        setList(newList);
      }
    },
    [itemConfig, list, props.searchFromServer, props.showSearch]
  );

  const onSearch = useCallback(
    async (itemIndex: number, searchValue: string) => {
      const config = itemConfig[itemIndex];
      if (!config.showSearch || !config.searchFromServer) return;
      if (!searchValue) {
        const newList = list.map((v, index) => {
          if (index < itemIndex) return v;
          return [];
        });
        setList(newList);
      } else {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        currentValue.current = searchValue;
        currentItem.current = itemIndex;
        timeout.current = setTimeout(() => {
          getList(
            itemIndex,
            itemIndex === 0 ? undefined : valueList[itemIndex - 1],
            searchValue
          );
        }, 300);
      }
    },
    [itemConfig, list, getList, valueList]
  );

  useImperativeHandle(ref, () => ({
    setList
  }));

  useMount(async () => {
    if (props.showSearch && props.searchFromServer) return;
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
            value={valueList[item]}
            options={itemList.map((item) => ({
              label: item[config.itemText || 'text'],
              value: item[config.itemKey || 'key'],
              itemData: item
            }))}
            onChange={async (valueData, itemData) => {
              if (!props.onChange) return;
              const newValue = valueList.slice(0, item);
              newValue[item] = valueData;
              const newSelectList = selectList.slice(0, item);
              newSelectList[item] = Array.isArray(itemData)
                ? itemData.map((item) => item.itemData)
                : itemData.itemData;
              setSelectList(newSelectList);
              props.onChange(newValue, newSelectList);
              if (item === numList.length - 1) return;
              await getList(item + 1, valueData);
              // if (config.hasChildren) {
              //   const data = Array.isArray(itemData) ? itemData : [itemData];
              //   let dataList: RecordData[] = [];
              //   data.forEach((item) => {
              //     dataList = dataList.concat(
              //       item.itemData[config.itemChildren || 'children']
              //     );
              //   });
              //   const newList = list.map((v, index) => {
              //     if (index <= item) return v;
              //     return [];
              //   });
              //   newList[item + 1] = dataList;
              //   setList(newList);
              // } else await getList(item + 1, valueData);
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
