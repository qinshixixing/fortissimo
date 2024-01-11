import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
  useEffect
} from 'react';
import type { ForwardedRef, Key } from 'react';
import { useMount } from '@fortissimo/hook';
import { checkFormEmpty } from '@fortissimo/util';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import { DataList } from '../index';
import type {
  DataListTableMsg,
  DataListOptConfig,
  DataListRowData,
  OptEditFormField,
  RecordData,
  KeyType,
  ValueType
} from '../index';

export type DataListProAllOptPosition = 'header' | 'row' | 'both';

export interface DataListProAllOptConfig<
  K extends string = string,
  T extends RecordData = RecordData
> extends DataListOptConfig<K, T> {
  position?: DataListProAllOptPosition;
  needSelect?: boolean;
}

export interface DataListProAllOptParams<
  K extends string = string,
  T extends RecordData = RecordData
> {
  optKey: K;
  rowKey?: Key;
  rowsKey: Key[];
  rowData?: T;
  rowsData: T[];
}

export type DataListProAllMsgConfig<T extends RecordData = RecordData> =
  DataListTableMsg<Partial<T>>;

export type DataListProAllSearchConfig<T extends RecordData = RecordData> =
  OptEditFormField<Partial<T>>;

export type DataListProAllGetDataParams<T extends RecordData = RecordData> =
  Partial<T>;

export type DataListProAllGetDataRes<T extends RecordData = RecordData> =
  Partial<T>[];

export interface DataListProAllProps<
  OPTK extends string = string,
  T extends RecordData = RecordData,
  S extends RecordData = RecordData
> {
  msgs: DataListProAllMsgConfig<Partial<T>>[];
  rowKey: KeyType<T>;
  disabledCheckedKey?: Key[];
  opts?: DataListProAllOptConfig<OPTK, T>[];
  optWidth?: number | string;
  search?: DataListProAllSearchConfig<S>[];
  canExport?: boolean;
  canTotalExport?: boolean;
  searchLabelCol?: number | null;
  searchColNum?: number;
  canSelect?: boolean;
  defaultSelectedValue?: ValueType<T>[];
  selectType?: 'checkbox' | 'radio';
  size?: SizeType;
  unFixOpt?: boolean;
  unFixHeader?: boolean;
  fixedColumnWidth?: boolean;
  resizeBaseWidth?: number;
  emptyText?: string;
  onGetData?: (
    params: DataListProAllGetDataParams<S>
  ) => Promise<DataListProAllGetDataRes<T>>;
  onExportData?: (params: Partial<S>) => Promise<void>;
  onOpt?: (
    params: DataListProAllOptParams<OPTK, Partial<T>>
  ) => Promise<void> | void;
  onExpandData?: (params: Partial<T>) => Promise<void>;
}

export const DataListProAll = forwardRef(function (
  props: DataListProAllProps,
  ref: ForwardedRef<unknown>
) {
  const rowKey = useMemo(() => props.rowKey || 'id', [props.rowKey]);
  const [data, setData] = useState<DataListRowData[]>([]);
  const [selectedValue, setSelectedValue] = useState<any[]>(
    props.defaultSelectedValue || []
  );
  const [selectedRows, setSelectedRows] = useState<DataListRowData[]>([]);

  const [searchData, setSearchData] = useState<Partial<Record<string, any>>>(
    {}
  );

  const opts = useMemo(() => {
    const data: {
      header: DataListOptConfig[];
      row: DataListOptConfig[];
    } = {
      header: [],
      row: []
    };
    if (!props.opts) return data;
    props.opts.forEach((item) => {
      if (item.position === 'header' || item.position === 'both') {
        data.header.push({
          ...item,
          disabled:
            item.disabled || (item.needSelect && selectedValue.length === 0)
        });
      }
      if (item.position === 'row' || item.position === 'both') {
        data.row.push({
          ...item,
          icon: undefined
        });
      }
    });
    return data;
  }, [props.opts, selectedValue]);

  const getData = useCallback(
    async (params: DataListProAllGetDataParams) => {
      setSelectedValue([]);
      setSelectedRows([]);
      if (!props.onGetData) return;
      const res = await props.onGetData(params || searchData);
      setData(res);
    },
    [props, searchData]
  );

  const [exportLoading, setExportLoading] = useState(false);
  const [exportDisabled, setExportDisabled] = useState(!props.canTotalExport);
  useEffect(() => {
    if (props.canTotalExport) setExportDisabled(false);
  }, [props.canTotalExport]);

  const exportData = useCallback(
    async (params?: Partial<RecordData>) => {
      if (!props.onExportData) return;
      const data = params || searchData;
      setExportLoading(true);
      try {
        await props.onExportData(data);
        setExportLoading(false);
      } catch (e) {
        setExportLoading(false);
      }
    },
    [searchData, props]
  );

  const opt = useCallback(
    async (params: DataListProAllOptParams) => {
      props.onOpt && (await props.onOpt(params));
    },
    [props]
  );

  useImperativeHandle(ref, () => ({
    getData,
    opt,
    getSelectedValue: () => selectedValue,
    getSelectedRows: () => selectedRows,
    setSelectedValue: (value: any[]) => {
      setSelectedValue(value);
      const newData: DataListRowData[] = [];
      data.forEach((item) => {
        if (value.includes(item[props.rowKey])) newData.push(item);
      });
      setSelectedRows(newData);
    }
  }));

  useMount(async () => {
    await getData({});
    const newData: DataListRowData[] = [];
    data.forEach((item) => {
      if (selectedValue.includes(item[props.rowKey])) newData.push(item);
    });
    setSelectedRows(newData);
  });

  return (
    <>
      <DataList.Search
        fields={props.search}
        labelCol={props.searchLabelCol}
        colNum={props.searchColNum}
        size={props.size}
        exportOpt={
          props.canExport
            ? {
                loading: exportLoading,
                disabled: exportDisabled
              }
            : null
        }
        onOpt={async (data, optKey) => {
          setSearchData(data);
          if (optKey === 'export') await exportData(data);
          else {
            if (optKey === 'reset' && !props.canTotalExport) {
              setExportDisabled(checkFormEmpty(data));
            }
            await getData(data);
          }
        }}
        headerOpts={opts.header}
        onHeaderOpt={async (optKey) => {
          await opt({
            optKey,
            rowsKey: selectedValue,
            rowsData: selectedRows
          });
        }}
        onValueChange={(value) => {
          if (props.canTotalExport) return;
          setExportDisabled(checkFormEmpty(value));
        }}
      />
      <DataList.Table
        data={data}
        msgList={props.msgs}
        rowKey={rowKey}
        optList={opts.row}
        optWidth={props.optWidth}
        canSelect={props.canSelect}
        selectType={props.selectType}
        selectedValue={selectedValue}
        disabledSelectedValue={props.disabledCheckedKey}
        emptyText={props.emptyText}
        size={props.size}
        sticky={!props.unFixHeader}
        resizeable={!props.fixedColumnWidth}
        fixOpt={!props.unFixOpt}
        resizeBaseWidth={props.resizeBaseWidth || 150}
        onSelect={(keys, rows) => {
          setSelectedValue(keys || []);
          setSelectedRows(rows || []);
        }}
        onOpt={async (optKey, rowKey, rowData) => {
          await opt({
            optKey,
            rowKey,
            rowsKey: [rowKey],
            rowData,
            rowsData: [rowData]
          });
        }}
        onExpand={async (open, item) => {
          if (!props.onExpandData) return;
          if (!open) return;
          if (item.children?.length > 0) return;
          await props.onExpandData(item);
        }}
      />
    </>
  );
});
