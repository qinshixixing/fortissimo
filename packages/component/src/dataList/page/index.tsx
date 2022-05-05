import React, { useMemo } from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';

export interface DataListPageProps {
  pageNo?: number;
  total?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onChange?: (pageNo: number, pageSize: number) => void;
}

export function Page(props: DataListPageProps) {
  const pageSizeOptions = useMemo(() => {
    if (props.pageSizeOptions) return props.pageSizeOptions;
    const data = [10];
    if (!props.total) return data;
    if (props.total > 10) data.push(20);
    if (props.total > 20) data.push(50);
    if (props.total > 50) data.push(100);
    return data;
  }, [props.total, props.pageSizeOptions]);

  const componentProps = useMemo<PaginationProps>(() => {
    const data: PaginationProps = {
      className: 'ft-data-list-page',
      total: props.total,
      pageSizeOptions,
      showSizeChanger: true,
      showQuickJumper: true,
      onChange: props.onChange
    };
    if (props.pageNo) data.current = props.pageNo;
    if (props.pageSize) data.pageSize = props.pageSize;
    return data;
  }, [
    pageSizeOptions,
    props.pageNo,
    props.total,
    props.pageSize,
    props.onChange
  ]);

  return <Pagination {...componentProps} />;
}
