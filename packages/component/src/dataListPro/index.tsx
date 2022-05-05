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
  DataListTableSortType
} from '../index';
import { EditFormField } from '../optForm';

export type DataListProOptPosition = 'header' | 'row' | 'both';

export interface DataListProOptConfig<
  K extends string = string,
  DK extends string = string,
  DV = any
> extends DataListOptConfig<K, DK, DV> {
  position?: DataListProOptPosition;
  needSelect?: boolean;
}

export interface DataListProOptParams<
  K extends string = string,
  DK extends string = string,
  DV = any
> {
  optKey: K;
  rowKey: DV | DV[];
  rowData?: Record<DK, DV>;
}

export interface DataListProGetDataParams<
  SK extends string = string,
  DK extends string = string,
  SV = any
> {
  pageNo?: number;
  pageSize?: number;
  sortKey?: DK;
  sortType?: DataListTableSortType;
  searchData?: Partial<Record<SK, SV>>;
}

export interface DataListProGetDataRes<K extends string = string, V = any> {
  total: number;
  data: Record<K, V>[];
}

export interface DataListProProps<
  DK extends string = string,
  SK extends string = string,
  OPTK extends string = string,
  DV = any,
  SV = any
> {
  msgs: DataListTableMsg<DK, DV>[];
  rowKey: DK;
  disabledCheckedKey?: DV[];
  opts?: DataListProOptConfig<OPTK, DK, DV>[];
  search?: EditFormField<SK, SV>[];
  canSelect?: boolean;
  resetPageNo?: boolean;
  onGetData?: (
    params: DataListProGetDataParams<SK, DK, SV>
  ) => Promise<DataListProGetDataRes<DK, DV>>;
  onOpt?: (params: DataListProOptParams<OPTK, DK, DV>) => Promise<void> | void;
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
          ...item
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
