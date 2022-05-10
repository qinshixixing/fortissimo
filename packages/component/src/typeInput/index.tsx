import React, { useMemo } from 'react';
import { Select, Input } from 'antd';

export interface TypeListConfig<T extends string = string> {
  key: T;
  name: string;
}

export interface TypeInputValue<T extends string = string> {
  type: T;
  data: string;
}

export interface TypeInputProps<T extends string = string> {
  typeList?: TypeListConfig<T>[];
  value?: TypeInputValue<T>;
  onChange?: (value: TypeInputValue) => void;
}

export function TypeINput(props: TypeInputProps) {
  const typeList = useMemo(() => props.typeList || [], [props.typeList]);

  const value = useMemo<TypeInputValue>(
    () =>
      props.value || {
        type: typeList.length ? typeList[0].name : '',
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
            {item.name}
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
