import React, {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useMemo
} from 'react';
import type { ForwardedRef } from 'react';

import { DataList } from '../index';
import type {
  DataListTableMsg,
  DataListOptConfig,
  DataListRowData,
  DataListTableSortType,
  EditFormFieldList,
  FormData
} from '../index';

type KeyOf<T> = Extract<keyof T, string>;
type ValueOf<T> = T[KeyOf<T>];

export type DataListProOptPosition = 'header' | 'row' | 'both';

export interface DataListProOptConfig<
  K extends string = string,
  T extends DataListRowData = DataListRowData
> extends DataListOptConfig<K, T> {
  position?: DataListProOptPosition;
  needSelect?: boolean;
}

export interface DataListProOptParams<
  K extends string = string,
  T extends DataListRowData = DataListRowData
> {
  optKey: K;
  rowKey: ValueOf<T> | ValueOf<T>[];
  rowData?: T;
}

export interface DataListProGetDataParams<
  S extends FormData = FormData,
  T extends DataListRowData = DataListRowData
> {
  pageNo?: number;
  pageSize?: number;
  sortKey?: KeyOf<T>;
  sortType?: DataListTableSortType;
  searchData?: Partial<S>;
}

export interface DataListProGetDataRes<
  T extends DataListRowData = DataListRowData
> {
  total: number;
  data: T[];
}

export interface DataListProProps<
  D extends DataListRowData = DataListRowData,
  S extends FormData = FormData,
  OPTK extends string = string
> {
  msgs: DataListTableMsg<D>[];
  rowKey: KeyOf<D>;
  disabledCheckedKey?: ValueOf<D>[];
  opts?: DataListProOptConfig<OPTK, D>[];
  search?: EditFormFieldList<S>;
  canSelect?: boolean;
  resetPageNo?: boolean;
  onGetData?: (
    params: DataListProGetDataParams<S, D>
  ) => Promise<DataListProGetDataRes<D>>;
  onOpt?: (params: DataListProOptParams<OPTK, D>) => Promise<void> | void;
}

export const DataListPro = forwardRef(function <
  D extends DataListRowData = DataListRowData,
  S extends FormData = FormData,
  OPTK extends string = string
>(props: DataListProProps<D, S, OPTK>, ref: ForwardedRef<unknown>) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<D[]>([]);
  const [selectedValue, setSelectedValue] = useState<ValueOf<D>[]>([]);

  const [searchData, setSearchData] = useState<Partial<S>>({});

  const [sortKey, setSortKey] = useState<KeyOf<D>>();
  const [sortType, setSortType] = useState<DataListTableSortType>('none');

  const opts = useMemo(() => {
    const data: {
      header: DataListOptConfig<OPTK, D>[];
      row: DataListOptConfig<OPTK, D>[];
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
          ...item
        });
      }
    });
    return data;
  }, [props.opts, selectedValue]);

  const getData = useCallback(
    async (params: DataListProGetDataParams<S, D>) => {
      setSelectedValue([]);
      const reqPageNo = params.pageNo || pageNo;
      const reqPageSize = params.pageSize || pageSize;
      const data: DataListProGetDataParams<S, D> = {
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
    async (params: DataListProOptParams<OPTK, D>) => {
      const data = params;
      props.onOpt && (await props.onOpt(data));
    },
    [props]
  );

  useImperativeHandle(ref, () => ({
    getData,
    opt
  }));

  useEffect(() => {
    getData({ pageNo: 1 });
  }, []);

  return (
    <>
      {props.search && (
        <DataList.Search
          list={props.search}
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
