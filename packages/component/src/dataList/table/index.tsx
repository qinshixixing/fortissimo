import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Table as AntTable } from 'antd';
import type { ColumnsType } from 'antd/lib/table/interface';

import { RowOpt } from '../index';
import type { DataListOptConfig } from '../index';

export type DataListRowData = Record<string, any>;

export type DataListTableSortType = 'ascend' | 'descend' | 'none';

export interface DataListTableMsg<K extends string = string, V = any> {
  key: K;
  name?: string;
  width?: number;
  sort?: boolean;
  render?: (value: V, record: Record<K, V>, index: number) => ReactNode;
}

export interface DataListTableProps<
  K extends string = string,
  V = any,
  OPTK extends string = string
> {
  data: Record<K, V>[];
  rowKey: K;
  msgList: DataListTableMsg<K, V>[];
  optList?: DataListOptConfig<OPTK, K, V>[];
  ellipsis?: boolean;
  canSelect?: boolean;
  selectedValue?: V[];
  disabledSelectedValue?: V[];
  onSort?: (key: K, type: DataListTableSortType) => void;
  onSelect?: (rowKeys?: V[]) => void;
  onOpt?: (optKey: OPTK, rowKey: V, rowData: Record<K, V>) => void;
}

export function Table(props: DataListTableProps) {
  const colums = useMemo<ColumnsType<DataListRowData>>(() => {
    const data: ColumnsType<DataListRowData> = [];
    if (props.msgList && props.msgList.length)
      props.msgList.forEach((item) => {
        data.push({
          key: item.key,
          dataIndex: item.key,
          title: item.name,
          ellipsis: Boolean(props.ellipsis),
          render:
            item.render ||
            ((data) => {
              return data || data === 0 ? data : '-';
            }),
          sorter: item.sort
        });
      });
    if (props.optList?.length)
      data.push({
        key: 'optItem',
        dataIndex: 'optItem',
        title: '操作',
        ellipsis: Boolean(props.ellipsis),
        render: (data, record) => {
          return (
            <RowOpt
              list={props.optList || []}
              data={record}
              onOpt={(optKey) => {
                props.onOpt &&
                  props.onOpt(optKey, record[props.rowKey], record);
              }}
            />
          );
        }
      });
    return data;
  }, [props]);

  return (
    <AntTable
      columns={colums}
      dataSource={props.data}
      rowKey={props.rowKey}
      rowSelection={
        props.canSelect
          ? {
              selectedRowKeys: props.selectedValue,
              onChange: (keys) => {
                props.onSelect && props.onSelect(keys);
              },
              getCheckboxProps: (record) => {
                return {
                  disabled: (props.disabledSelectedValue || []).includes(
                    record[props.rowKey]
                  )
                };
              }
            }
          : undefined
      }
      pagination={false}
      onChange={(pagination, filters, sorter, { action }) => {
        const info = Array.isArray(sorter) ? sorter[0] : sorter;
        if (action === 'sort') {
          props.onSort &&
            props.onSort(info.columnKey as string, info.order || 'none');
        }
      }}
    />
  );
}
