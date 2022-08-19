import React, {
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect
} from 'react';
import type { SelectProps } from 'antd';
import type { RecordData, ValueType } from '../../index';
import type { SelectDataConfig } from '../index';
import { Item } from '../item';

export interface SelectDataLinkProps<T extends RecordData = RecordData>
  extends SelectDataConfig<T> {
  itemConfig?: SelectDataConfig[];
  itemNum: number;
  value?: SelectProps<ValueType<T>, T>['value'][];
  onChange?: (
    value: SelectProps<ValueType<T>, T>['value'][],
    option: (T | T[])[]
  ) => void;
}

export const Link = forwardRef((props: SelectDataLinkProps, ref) => {
  const refMap = useRef<any[]>([]);
  const oldValue = useRef<
    SelectProps<ValueType<RecordData>, RecordData>['value'][]
  >([]);
  const selectOption = useRef<(RecordData | RecordData[])[]>([]);

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
    const propsConfig = { ...props };
    Reflect.deleteProperty(propsConfig, 'value');
    Reflect.deleteProperty(propsConfig, 'onChange');
    Reflect.deleteProperty(propsConfig, 'itemNum');
    Reflect.deleteProperty(propsConfig, 'itemConfig');
    const config: SelectDataConfig[] = numList.map((item) => ({
      ...propsConfig,
      ...(data[item] || {})
    }));
    return config;
  }, [numList, props]);

  const value = useMemo<
    SelectProps<ValueType<RecordData>, RecordData>['value'][]
  >(() => props.value || [], [props.value]);

  useImperativeHandle(ref, () => ({
    setList: (data: RecordData[], index: number) => {
      refMap.current[index]?.setList(data);
    }
  }));

  useEffect(() => {
    value.forEach((item, index) => {
      if (index === numList.length - 1) return;
      if (item !== oldValue.current[index]) {
        if (!item) refMap.current[index + 1]?.setList([]);
        else {
          const childConfig = itemConfig[index + 1];
          if (childConfig.showSearch && childConfig.searchFromServer)
            refMap.current[index + 1]?.setList([]);
          if (!childConfig.onGetData) return;
          childConfig.onGetData(undefined, index, item).then((data) => {
            refMap.current[index + 1]?.setList(data);
          });
        }
      }
    });
    oldValue.current = value;
  }, [itemConfig, numList.length, value]);

  return (
    <>
      {numList.map((item) => {
        const config = itemConfig[item];

        return (
          <Item
            key={item}
            {...config}
            ref={(f) => {
              refMap.current[item] = f;
            }}
            onGetData={async (searchValue) => {
              if (!config.onGetData) return [];
              return await config.onGetData(searchValue, item, value[item]);
            }}
            value={value[item]}
            onChange={(data, option) => {
              const newValue = value.slice(0, item);
              newValue[item] = data;
              const newOption = selectOption.current.slice(0, item);
              newOption[item] = option;
              selectOption.current = newOption;
              props.onChange && props.onChange(newValue, newOption);
            }}
          />
        );
      })}
    </>
  );
});
