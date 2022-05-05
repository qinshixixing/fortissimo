import React from 'react';
import { Space } from 'antd';
import type { OperationListProps } from '../index';
import { Item } from '../index';

export function List<K extends string = string, T = any>(
  props: OperationListProps<K, T>
) {
  return (
    <Space size={'middle'} className={props.className}>
      {(props.list || []).map((item) => (
        <Item
          {...item}
          type={item.type || props.type}
          key={item.key}
          onOpt={() => {
            props.onOpt && props.onOpt(item.key);
          }}
          data={props.data || item.data}
        />
      ))}
    </Space>
  );
}
