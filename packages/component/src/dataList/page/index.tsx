import React, { useMemo } from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

export interface DataListPageProps {
  pageNo?: number;
  total?: number;
  pageSize?: number;
  hideSizeChanger?: boolean;
  hideQuickJumper?: boolean;
  hideTip?: boolean;
  hideOnSinglePage?: boolean;
  size?: SizeType;
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
    if (props.total > 100) data.push(200);
    if (props.total > 200) data.push(500);
    if (props.total > 500) data.push(1000);
    return data;
  }, [props.total, props.pageSizeOptions]);

  const componentProps = useMemo<PaginationProps>(() => {
    const data: PaginationProps = {
      className: 'ft-data-list-page',
      total: props.total,
      pageSizeOptions,
      showSizeChanger: !props.hideSizeChanger,
      showQuickJumper: !props.hideQuickJumper,
      hideOnSinglePage: props.hideOnSinglePage,
      onChange: props.onChange,
      size: props.size === 'small' ? 'small' : 'default'
    };
    if (props.pageNo) data.current = props.pageNo;
    if (props.pageSize) data.pageSize = props.pageSize;
    if (!props.hideTip)
      data.showTotal = (total, range) =>
        `第${range[0]}条-第${range[1]}条  共${total}条`;
    return data;
  }, [
    props.total,
    props.hideSizeChanger,
    props.hideQuickJumper,
    props.hideOnSinglePage,
    props.onChange,
    props.size,
    props.pageNo,
    props.pageSize,
    props.hideTip,
    pageSizeOptions
  ]);

  return <Pagination {...componentProps} />;
}
