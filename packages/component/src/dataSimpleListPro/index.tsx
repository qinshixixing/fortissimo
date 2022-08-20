import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { useMount } from '@fortissimo/hook';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import type { DataListOptConfig, OptFormField } from '../index';
import { DataList } from '../index';

export type DataSimpleListProOptPosition = 'header' | 'row' | 'both';

export interface DataSimpleListProOptConfig<K extends string = string, T = any>
  extends DataListOptConfig<K, T> {
  position?: DataSimpleListProOptPosition;
}

export interface DataSimpleListProOptParams<
  K extends string = string,
  T = any
> {
  optKey: K;
  rowKey?: number;
  rowData?: T;
}

export type DataSimpleListProSearchConfig<T = any> = Partial<
  Omit<
    OptFormField<{ data: T }>,
    | 'key'
    | 'name'
    | 'required'
    | 'labelCol'
    | 'labelTip'
    | 'editComponent'
    | 'showComponent'
    | 'editValuePropName'
    | 'showValuePropName'
  >
>;
export interface DataSimpleListProGetDataParams<T = any> {
  pageNo?: number;
  pageSize?: number;
  searchData?: T;
}

export interface DataSimpleListProGetDataRes<T = any> {
  total: number;
  data: T[];
}

export interface DataSimpleListProProps<OPTK extends string = string, T = any> {
  msgRender?: (value: T, index: number) => ReactNode;
  search?: DataSimpleListProSearchConfig<T>;
  opts?: DataSimpleListProOptConfig<OPTK, T>[];
  canExport?: boolean;
  canTotalExport?: boolean;
  resetPageNo?: boolean;
  hideSizeChanger?: boolean;
  autoHidePage?: boolean;
  size?: SizeType;
  emptyText?: string;
  onGetData?: (
    params: DataSimpleListProGetDataParams<T>
  ) => Promise<DataSimpleListProGetDataRes<T>>;
  onExportData?: (params: T) => Promise<void>;
  onOpt?: (params: DataSimpleListProOptParams<OPTK, T>) => Promise<void> | void;
}

export const DataSimpleListPro = forwardRef(function (
  props: DataSimpleListProProps,
  ref: ForwardedRef<unknown>
) {
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const [searchData, setSearchData] = useState<any>();

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
        data.header.push(item);
      }
      if (item.position === 'row' || item.position === 'both') {
        data.row.push({
          ...item,
          icon: undefined
        });
      }
    });
    return data;
  }, [props.opts]);

  const getData = useCallback(
    async (params: DataSimpleListProGetDataParams) => {
      if (!props.onGetData) return;
      const reqPageNo = params.pageNo || pageNo;
      const reqPageSize = params.pageSize || pageSize;
      const data: DataSimpleListProGetDataParams = {
        pageNo: reqPageNo,
        pageSize: reqPageSize,
        searchData: Reflect.has(params, 'searchData')
          ? params.searchData
          : searchData
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
    [pageNo, pageSize, searchData, props]
  );

  const [exportLoading, setExportLoading] = useState(false);
  const [exportDisabled, setExportDisabled] = useState(!props.canTotalExport);

  const exportData = useCallback(
    async (params?: any) => {
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
    async (params: DataSimpleListProOptParams) => {
      props.onOpt && (await props.onOpt(params));
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
          fields={[
            {
              key: 'data',
              name: '',
              ...props.search
            }
          ]}
          labelCol={0}
          colNum={2}
          size={props.size}
          inlineOpt
          exportOpt={
            props.canExport
              ? {
                  loading: exportLoading,
                  disabled: exportDisabled
                }
              : null
          }
          onOpt={async (formData, optKey) => {
            const data = formData.data;
            setSearchData(data);
            if (optKey === 'export') await exportData(data);
            else {
              if (optKey === 'reset' && !props.canTotalExport) {
                setExportDisabled(!data);
              }
              const resetPageNo = 1;
              setPageNo(resetPageNo);
              await getData({
                pageNo: resetPageNo,
                searchData: data
              });
            }
          }}
        />
      )}
      {opts.header && opts.header.length > 0 && (
        <DataList.HeaderOpt
          list={opts.header}
          size={props.size}
          onOpt={async (optKey) => {
            await opt({
              optKey
            });
          }}
        />
      )}
      <DataList.List
        data={data}
        optList={opts.row}
        size={props.size}
        emptyText={props.emptyText}
        onOpt={async (optKey, rowKey, rowData) => {
          await opt({
            optKey,
            rowKey,
            rowData
          });
        }}
        render={props.msgRender}
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
