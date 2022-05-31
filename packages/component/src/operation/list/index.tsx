import React, { useMemo } from 'react';
import { Space } from 'antd';
import type { OperationListProps, OperationItemConfig } from '../index';
import { Item } from '../index';

export function List(props: OperationListProps) {
  const list = useMemo(() => {
    if (!props.list) return [];
    const data: OperationItemConfig[] = [];
    props.list.forEach((item) => {
      if (!item.hide) {
        data.push(item);
        return;
      }
      if (item.hide === true) return;
      const hide = item.hide(props.data || item.data);
      if (!hide)
        data.push({
          ...item,
          hide: false
        });
    });
    return data;
  }, [props.list, props.data]);

  return (
    <Space size={'middle'} className={props.className}>
      {list.length > 0
        ? list.map((item) => (
            <Item
              {...item}
              type={item.type || props.type}
              key={item.key}
              onOpt={() => {
                props.onOpt && props.onOpt(item.key);
              }}
              data={props.data || item.data}
            />
          ))
        : props.emptyText || ''}
    </Space>
  );
}
