import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo
} from 'react';
import type { ForwardedRef } from 'react';
import { useMount } from '@fortissimo/hook';

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
  rowKey: ValueType<T> | ValueType<T>[];
  rowData?: T;
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
  search?: DataListProSearchConfig<S>[];
  searchLabelCol?: number | null;
  canSelect?: boolean;
  resetPageNo?: boolean;
  onGetData?: (
    params: DataListProGetDataParams<S, KeyType<T>>
  ) => Promise<DataListProGetDataRes<T>>;
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
  const [selectedValue, setSelectedValue] = useState<any[]>([]);

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
      const reqPageNo = params.pageNo || pageNo;
      const reqPageSize = params.pageSize || pageSize;
      const data: DataListProGetDataParams = {
        pageNo: reqPageNo,
        pageSize: reqPageSize,
        sortKey: params.sortKey || sortKey,
        sortType: params.sortType || sortType,
        searchData: params.searchData || searchData
      };
      if (props.onGetData) {
        const res = await props.onGetData(data);
        const maxPageNo = Math.ceil(res.total / reqPageSize);
        if (maxPageNo > 0 && maxPageNo < reqPageNo) {
          await getData({ pageNo: maxPageNo });
          setPageNo(maxPageNo);
        } else {
          setTotal(res.total);
          setData(res.data);
        }
      }
    },
    [pageNo, pageSize, sortKey, sortType, searchData, props]
  );

  const opt = useCallback(
    async (params: DataListProOptParams) => {
      const data = params;
      props.onOpt && (await props.onOpt(data));
    },
    [props]
  );

  useImperativeHandle(ref, () => ({
    getData,
    opt
  }));

  useMount(async () => {
    await getData({ pageNo: 1 });
  });

  return (
    <>
      {props.search && (
        <DataList.Search
          list={props.search}
          labelCol={props.searchLabelCol}
          onSearch={(data) => {
            setSearchData(data);
            getData({
              pageNo: 1,
              searchData: data
            });
          }}
        />
      )}
      {opts.header && (
        <DataList.HeaderOpt
          list={opts.header}
          onOpt={(optKey) => {
            opt({
              optKey,
              rowKey: selectedValue
            });
          }}
        />
      )}
      <DataList.Table
        data={data}
        msgList={props.msgs}
        rowKey={props.rowKey}
        optList={opts.row}
        canSelect={props.canSelect}
        selectedValue={selectedValue}
        disabledSelectedValue={props.disabledCheckedKey}
        onSelect={(keys) => {
          setSelectedValue(keys || []);
        }}
        onSort={(key, sort) => {
          setSortKey(key);
          setSortType(sort);
          const pageNoData = props.resetPageNo ? 1 : pageNo;
          setPageNo(pageNoData);
          getData({
            pageNo: pageNoData,
            sortKey: key,
            sortType: sort
          });
        }}
        onOpt={(optKey, rowKey, rowData) => {
          opt({
            optKey,
            rowKey,
            rowData
          });
        }}
      />
      <DataList.Page
        pageNo={pageNo}
        pageSize={pageSize}
        total={total}
        onChange={(newPageNo, newPageSize) => {
          let pageNoData = newPageNo;
          if (newPageSize !== pageSize && props.resetPageNo) pageNoData = 1;
          setPageNo(pageNoData);
          setPageSize(newPageSize);
          getData({
            pageNo: pageNoData,
            pageSize: newPageSize
          });
        }}
      />
    </>
  );
});
