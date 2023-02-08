import React, { useMemo } from 'react';
import type { Key } from 'react';
import { Select, Input } from 'antd';
import type { SelectProps, InputProps } from 'antd';

export interface TypeListConfig<T extends Key = Key> {
  key: T;
  text: string;
}

export interface TypeInputValue<T extends Key = Key> {
  type: T;
  data: string;
}

export interface TypeInputProps<T extends Key = Key> {
  typeList?: TypeListConfig<T>[];
  value?: TypeInputValue<T>;
  onChange?: (value: TypeInputValue) => void;
  selectProps?: SelectProps<T, TypeListConfig>;
  inputProps?: InputProps;
  needData?: boolean;
}

export function TypeInput(props: TypeInputProps) {
  const typeList = useMemo(() => props.typeList || [], [props.typeList]);

  const needData = useMemo(() => {
    if (typeof props.needData !== 'boolean') return true;
    return props.needData;
  }, [props.needData]);

  const value = useMemo<TypeInputValue>(
    () =>
      props.value || {
        type: needData && typeList.length ? typeList[0].key : '',
        data: ''
      },
    [needData, props.value, typeList]
  );

  return (
    <div className={'ft-type-input'}>
      <Select
        className={'ft-type-input-select'}
        allowClear={!needData}
        {...props.selectProps}
        value={value.type}
        onChange={(value) => {
          props.onChange &&
            props.onChange({
              type: value,
              data: ''
            });
        }}
      >
        {typeList.map((item) => (
          <Select.Option key={item.key} value={item.key}>
            {item.text}
          </Select.Option>
        ))}
      </Select>
      <Input
        allowClear
        className={'ft-type-input-input'}
        {...props.inputProps}
        value={value.data}
        disabled={!value.type}
        onChange={(e) => {
          props.onChange &&
            props.onChange({
              type: value.type,
              data: e.target.value
            });
        }}
      />
    </div>
  );
}
