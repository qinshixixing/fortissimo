import React, { useMemo, useState } from 'react';
import type { ReactNode, Key } from 'react';
import { Resizable } from 'react-resizable';
import type { ResizableProps } from 'react-resizable';
import { Table as AntTable } from 'antd';
import type {
  ColumnsType,
  ColumnType,
  ColumnGroupType
} from 'antd/lib/table/interface';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import { RowOpt } from '../index';
import type { DataListOptConfig } from '../index';
import type { RecordData, KeyType, ValueType } from '../../index';

export type DataListRowData = Record<string, any>;

export type DataListTableSortType = 'ascend' | 'descend' | 'none';

export interface DataListTableMsg<T extends RecordData = RecordData> {
  key: KeyType<T>;
  name?: string;
  width?: number | string;
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
  optWidth?: number | string;
  ellipsis?: boolean;
  canSelect?: boolean;
  selectType?: 'checkbox' | 'radio';
  size?: SizeType;
  sticky?: boolean;
  resizeable?: boolean;
  resizeBaseWidth?: number;
  selectedValue?: ValueType<T>[];
  disabledSelectedValue?: Key[];
  emptyText?: string;
  onSort?: (key: KeyType<T>, type: DataListTableSortType) => void;
  onSelect?: (rowKeys?: ValueType<T>[], rows?: T[]) => void;
  onOpt?: (optKey: OPTK, rowKey: ValueType<T>, rowData: T) => void;
}

function ResizeableTitle(props: ResizableProps) {
  const { onResize, width, ...restProps } = props;

  return typeof width === 'number' && width > 0 ? (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  ) : (
    <th {...restProps} />
  );
}

export function Table(props: DataListTableProps) {
  const emptyText = useMemo(
    () => (typeof props.emptyText === 'string' ? props.emptyText : '-'),
    [props.emptyText]
  );

  const [resizeWidth, setResizeWidth] = useState<Record<string, number>>({});

  const columns = useMemo<ColumnsType<DataListRowData>>(() => {
    const data: ColumnsType<DataListRowData> = [];
    if (props.msgList && props.msgList.length)
      props.msgList
        .filter((item) => item)
        .forEach((item) => {
          data.push({
            key: item.key,
            dataIndex: item.key,
            width:
              (props.resizeable
                ? resizeWidth[item.key] ||
                  (typeof item.width === 'number'
                    ? item.width
                    : props.resizeBaseWidth)
                : item.width) || 'auto',
            title: item.name,
            ellipsis: Boolean(props.ellipsis),
            onHeaderCell: props.resizeable
              ? (
                  column:
                    | ColumnGroupType<DataListRowData>
                    | ColumnType<DataListRowData>
                ) => ({
                  width: column.width,
                  onResize: (e: Event, { size }: any) => {
                    setResizeWidth({
                      ...resizeWidth,
                      [item.key]: size.width
                    });
                  }
                })
              : undefined,
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
        width:
          (props.resizeable
            ? props.optWidth || props.resizeBaseWidth
            : props.optWidth) || 'auto',
        title: '操作',
        ellipsis: Boolean(props.ellipsis),
        render: (data, record) => {
          return (
            <RowOpt
              size={props.size}
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
  }, [props, resizeWidth, emptyText]);

  return (
    <AntTable
      tableLayout={'fixed'}
      className={'ft-data-list-table'}
      columns={columns}
      dataSource={props.data}
      rowKey={props.rowKey}
      size={props.size}
      sticky={props.sticky}
      scroll={{ y: '100%' }}
      components={
        props.resizeable ? { header: { cell: ResizeableTitle } } : undefined
      }
      rowSelection={
        props.canSelect
          ? {
              type: props.selectType === 'radio' ? 'radio' : 'checkbox',
              selectedRowKeys: props.selectedValue,
              onChange: (keys, rows) => {
                props.onSelect && props.onSelect(keys, rows);
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
