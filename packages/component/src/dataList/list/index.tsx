import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { List as AntList } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import { RowOpt } from '../index';
import type { DataListOptConfig } from '../index';

export interface DataListListProps<T = any, OPTK extends string = string> {
  data: T[];
  optList?: DataListOptConfig<OPTK, T>[];
  size?: SizeType;
  emptyText?: string;
  onOpt?: (optKey: OPTK, rowKey: number, rowData: T) => void;
  render?: (value: T, index: number) => ReactNode;
}

export function List(props: DataListListProps) {
  const emptyText = useMemo(
    () => (typeof props.emptyText === 'string' ? props.emptyText : '-'),
    [props.emptyText]
  );

  return (
    <AntList
      className={'ft-data-list-list'}
      bordered
      dataSource={props.data}
      size={props.size === 'middle' ? 'default' : props.size}
      renderItem={(data, index) => (
        <AntList.Item
          actions={
            props.optList?.length
              ? [
                  <RowOpt
                    key={'opt'}
                    size={props.size}
                    list={props.optList || []}
                    data={data}
                    emptyText={emptyText}
                    onOpt={(optKey) => {
                      props.onOpt && props.onOpt(optKey, index, data);
                    }}
                  />
                ]
              : undefined
          }
        >
          {props.render
            ? props.render(data, index)
            : data || data === 0
            ? data
            : emptyText}
        </AntList.Item>
      )}
    />
  );
}
