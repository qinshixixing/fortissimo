import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Table as AntTable } from 'antd';
import type { ColumnsType } from 'antd/lib/table/interface';

import { RowOpt } from '../index';
import type { DataListOptConfig } from '../index';
import type { RecordData, KeyType, ValueType } from '../../index';

export type DataListRowData = Record<string, any>;

export type DataListTableSortType = 'ascend' | 'descend' | 'none';

export interface DataListTableMsg<T extends RecordData = RecordData> {
  key: KeyType<T>;
  name?: string;
  width?: number;
  sort?: boolean;
  render?: (value: ValueType<T>, record: T, index: number) => ReactNode;
}

export interface DataListTableProps<
  T extends RecordData = RecordData,
  OPTK extends string = string
> {
  data: T[];
  rowKey: KeyType<T>;
  msgList: DataListTableMsg<T>[];
  optList?: DataListOptConfig<OPTK, T>[];
  ellipsis?: boolean;
  canSelect?: boolean;
  selectedValue?: ValueType<T>[];
  disabledSelectedValue?: ValueType<T>[];
  emptyText?: string;
  onSort?: (key: KeyType<T>, type: DataListTableSortType) => void;
  onSelect?: (rowKeys?: ValueType<T>[]) => void;
  onOpt?: (optKey: OPTK, rowKey: ValueType<T>, rowData: T) => void;
}

export function Table(props: DataListTableProps) {
  const emptyText = useMemo(
    () => (typeof props.emptyText === 'string' ? props.emptyText : '-'),
    [props.emptyText]
  );

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
              return data || data === 0 ? data : emptyText;
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
              emptyText={emptyText}
              onOpt={(optKey) => {
                props.onOpt &&
                  props.onOpt(optKey, record[props.rowKey], record);
              }}
            />
          );
        }
      });
    return data;
  }, [props, emptyText]);

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
