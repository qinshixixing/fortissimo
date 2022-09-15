import React, { useMemo } from 'react';
import type { Key } from 'react';
import { Select, Input } from 'antd';

export interface TypeListConfig<T extends Key = string> {
  key: T;
  text: string;
}

export interface TypeInputValue<T extends Key = string> {
  type: T;
  data: string;
}

export interface TypeInputProps<T extends Key = string> {
  typeList?: TypeListConfig<T>[];
  value?: TypeInputValue<T>;
  onChange?: (value: TypeInputValue) => void;
}

export function TypeInput(props: TypeInputProps) {
  const typeList = useMemo(() => props.typeList || [], [props.typeList]);

  const value = useMemo<TypeInputValue>(
    () =>
      props.value || {
        type: typeList.length ? typeList[0].key : '',
        data: ''
      },
    [props.value, typeList]
  );

  return (
    <div className={'ft-type-input'}>
      <Select
        className={'ft-type-input-select'}
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
        className={'ft-type-input-input'}
        value={value.data}
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
