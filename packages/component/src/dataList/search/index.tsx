import React, { useCallback, useMemo, useRef } from 'react';

import { OptForm, Operation } from '../../index';
import type {
  OptEditFormField,
  OptFormMethods,
  OperationItemConfig,
  RecordData
} from '../../index';

export type DataListSearchDefaultOpt = 'search' | 'reset' | 'export';

export interface DataListSearchProps<T extends RecordData = RecordData> {
  list: OptEditFormField<T>[];
  labelCol?: number | null;
  showExport?: boolean;
  loading?: Partial<Record<DataListSearchDefaultOpt, boolean>>;
  opts?: OperationItemConfig[];
  onOpt: (data: Partial<T>, optKey: string) => void;
}

export function Search(props: DataListSearchProps) {
  const formRef = useRef<OptFormMethods>(null);

  const loading = useMemo<Record<DataListSearchDefaultOpt, boolean>>(() => {
    const defaultLoading: Record<DataListSearchDefaultOpt, boolean> = {
      search: false,
      reset: false,
      export: false
    };
    return {
      ...defaultLoading,
      ...(props.loading || {})
    };
  }, [props.loading]);

  const searchData = useCallback(
    (optKey: string) => {
      const value = formRef.current?.getData();
      props.onOpt(value || {}, optKey);
    },
    [formRef, props]
  );

  const opts = useMemo(() => {
    if (props.opts === null) return null;
    const defaultOpts: OperationItemConfig<
      DataListSearchDefaultOpt,
      Record<DataListSearchDefaultOpt, any>
    >[] = [
      {
        key: 'search',
        name: '查询',
        type: 'primary',
        loading: loading.search
      },
      {
        key: 'reset',
        name: '重置',
        loading: loading.reset
      }
    ];
    if (props.showExport)
      defaultOpts.push({
        key: 'export',
        name: '导出',
        loading: props.showExport && loading.export
      });
    return (
      <Operation.List
        type={'default'}
        list={props.opts || defaultOpts}
        onOpt={(optKey) => {
          if (optKey === 'reset') formRef.current?.reset();
          searchData(optKey);
        }}
      />
    );
  }, [
    props.opts,
    props.showExport,
    loading.search,
    loading.reset,
    loading.export,
    searchData
  ]);

  return (
    <div className={'ft-data-list-search'}>
      <OptForm
        ref={formRef}
        mode={'edit'}
        colNum={3}
        labelCol={props.labelCol}
        fields={props.list}
      />
      <div className={'ft-data-list-search-opt'}>{opts}</div>
    </div>
  );
}
