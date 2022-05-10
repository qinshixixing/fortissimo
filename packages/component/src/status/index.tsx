import React, { memo } from 'react';
import type { Key } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';

export interface StatusConfig<T extends Key = string> {
  key: T;
  text: string;
}

export interface EditStatusProps<T extends Key = string> extends SelectProps {
  keys?: T[];
}

export function status<T extends Key = string>(config: StatusConfig<T>[]) {
  const data: Map<T, string> = new Map();
  const keys: T[] = [];

  config.forEach((item) => {
    keys.push(item.key);
    data.set(item.key, item.text);
  });

  const getStatusText = (status?: T): string => {
    if (!status) return '未知';
    return data.get(status) || '未知';
  };

  const EditStatus = memo((props: EditStatusProps<T>) => {
    return (
      <Select placeholder={'请选择'} {...props}>
        {(props.keys || keys).map((item) => (
          <Select.Option key={item} value={item}>
            {getStatusText(item)}
          </Select.Option>
        ))}
      </Select>
    );
  });

  const ShowStatus = memo((props: { value?: T }) => {
    return <>{getStatusText(props.value || undefined)}</>;
  });

  return { EditStatus, ShowStatus };
}
