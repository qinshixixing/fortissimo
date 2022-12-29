import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo,
  useEffect
} from 'react';
import type { ForwardedRef } from 'react';
import { useMount } from '@fortissimo/hook';
import { checkFormEmpty } from '@fortissimo/util';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import { DataList } from '../index';
import type {
  DataListTableMsg,
  DataListOptConfig,
  DataListRowData,
  DataListTableSortType,
  OptEditFormField,
  RecordData,
  KeyType,
  ValueType
} from '../index';

export type DataListProOptPosition = 'header' | 'row' | 'both';

export interface DataListProOptConfig<
  K extends string = string,
  T extends RecordData = RecordData
> extends DataListOptConfig<K, T> {
  position?: DataListProOptPosition;
  needSelect?: boolean;
}

export interface DataListProOptParams<
  K extends string = string,
  T extends RecordData = RecordData
> {
  optKey: K;
  rowKey?: ValueType<T>;
  rowsKey: ValueType<T>[];
  rowData?: Partial<T>;
  rowsData: Partial<T>[];
}

export type DataListProMsgConfig<T extends RecordData = RecordData> =
  DataListTableMsg<Partial<T>>;

export type DataListProSearchConfig<T extends RecordData = RecordData> =
  OptEditFormField<Partial<T>>;

export interface DataListProGetDataParams<
  T extends RecordData = RecordData,
  K extends string = string
> {
  pageNo?: number;
  pageSize?: number;
  sortKey?: K;
  sortType?: DataListTableSortType;
  searchData?: Partial<T>;
}

export interface DataListProGetDataRes<T extends RecordData = RecordData> {
  total: number;
  data: Partial<T>[];
}

export interface DataListProProps<
  OPTK extends string = string,
  T extends RecordData = RecordData,
  S extends RecordData = RecordData
> {
  msgs: DataListProMsgConfig<Partial<T>>[];
  rowKey: KeyType<T>;
  disabledCheckedKey?: ValueType<T>;
  opts?: DataListProOptConfig<OPTK, T>[];
  optWidth?: number | string;
  search?: DataListProSearchConfig<S>[];
  canExport?: boolean;
  canTotalExport?: boolean;
  searchLabelCol?: number | null;
  searchColNum?: number;
  canSelect?: boolean;
  defaultSelectedValue?: ValueType<T>[];
  selectType?: 'checkbox' | 'radio';
  resetPageNo?: boolean;
  hideSizeChanger?: boolean;
  autoHidePage?: boolean;
  size?: SizeType;
  sticky?: boolean;
  resizeable?: boolean;
  resizeBaseWidth?: number;
  emptyText?: string;
  onGetData?: (
    params: DataListProGetDataParams<S, KeyType<T>>
  ) => Promise<DataListProGetDataRes<T>>;
  onExportData?: (params: Partial<S>) => Promise<void>;
  onOpt?: (params: DataListProOptParams<OPTK, T>) => Promise<void> | void;
}

export const DataListPro = forwardRef(function (
  props: DataListProProps,
  ref: ForwardedRef<unknown>
) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DataListRowData[]>([]);
  const [selectedValue, setSelectedValue] = useState<any[]>(
    props.defaultSelectedValue || []
  );
  const [selectedRows, setSelectedRows] = useState<DataListRowData[]>([]);

  const [searchData, setSearchData] = useState<Partial<Record<string, any>>>(
    {}
  );

  const [sortKey, setSortKey] = useState<string>();
  const [sortType, setSortType] = useState<DataListTableSortType>('none');

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
    async (params: DataListProGetDataParams) => {
      setSelectedValue([]);
      setSelectedRows([]);
      if (!props.onGetData) return;
      const reqPageNo = params.pageNo || pageNo;
      const reqPageSize = params.pageSize || pageSize;
      const data: DataListProGetDataParams = {
        pageNo: reqPageNo,
        pageSize: reqPageSize,
        sortKey: params.sortKey || sortKey,
        sortType: params.sortType || sortType,
        searchData: params.searchData || searchData
      };
      const res = await props.onGetData(data);
      const maxPageNo = Math.ceil(res.total / reqPageSize);
      if (maxPageNo > 0 && maxPageNo < reqPageNo) {
        await getData({ pageNo: maxPageNo });
        setPageNo(maxPageNo);
      } else {
        setTotal(res.total);
        setData(res.data);
      }
    },
    [pageNo, pageSize, sortKey, sortType, searchData, props]
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
    async (params: DataListProOptParams) => {
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
    await getData({ pageNo: 1 });
    const newData: DataListRowData[] = [];
    data.forEach((item) => {
      if (selectedValue.includes(item[props.rowKey])) newData.push(item);
    });
    setSelectedRows(newData);
  });

  return (
    <>
      {props.search && props.search.length > 0 && (
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
              const resetPageNo = 1;
              setPageNo(resetPageNo);
              await getData({
                pageNo: resetPageNo,
                searchData: data
              });
            }
          }}
          onValueChange={(value) => {
            if (props.canTotalExport) return;
            setExportDisabled(checkFormEmpty(value));
          }}
        />
      )}
      {opts.header && opts.header.length > 0 && (
        <DataList.HeaderOpt
          list={opts.header}
          size={props.size}
          onOpt={async (optKey) => {
            await opt({
              optKey,
              rowsKey: selectedValue,
              rowsData: selectedRows
            });
          }}
        />
      )}
      <DataList.Table
        data={data}
        msgList={props.msgs}
        rowKey={props.rowKey}
        optList={opts.row}
        optWidth={props.optWidth}
        canSelect={props.canSelect}
        selectType={props.selectType}
        selectedValue={selectedValue}
        disabledSelectedValue={props.disabledCheckedKey}
        emptyText={props.emptyText}
        size={props.size}
        sticky={props.sticky}
        resizeable={props.resizeable}
        resizeBaseWidth={props.resizeBaseWidth || 150}
        onSelect={(keys, rows) => {
          setSelectedValue(keys || []);
          setSelectedRows(rows || []);
        }}
        onSort={async (key, sort) => {
          setSortKey(key);
          setSortType(sort);
          const pageNoData = props.resetPageNo ? 1 : pageNo;
          setPageNo(pageNoData);
          await getData({
            pageNo: pageNoData,
            sortKey: key,
            sortType: sort
          });
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
      />
      <DataList.Page
        pageNo={pageNo}
        pageSize={pageSize}
        total={total}
        size={props.size}
        hideSizeChanger={props.hideSizeChanger}
        hideOnSinglePage={props.autoHidePage}
        onChange={async (newPageNo, newPageSize) => {
          let pageNoData = newPageNo;
          if (newPageSize !== pageSize && props.resetPageNo) pageNoData = 1;
          setPageNo(pageNoData);
          setPageSize(newPageSize);
          await getData({
            pageNo: pageNoData,
            pageSize: newPageSize
          });
        }}
      />
    </>
  );
});
