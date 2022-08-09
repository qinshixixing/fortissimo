import React, { useCallback, useMemo, useRef, useState } from 'react';

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
  allowTotalExport?: boolean;
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

  const [exportDisabled, setExportDisabled] = useState(!props.allowTotalExport);
  const checkExportDisabled = useCallback(
    (data?: RecordData) => {
      if (!props.showExport || props.allowTotalExport) return;
      const isEmpty = formRef.current?.checkFormEmpty(data);
      setExportDisabled(Boolean(isEmpty));
    },
    [props.showExport, props.allowTotalExport]
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
        loading: props.showExport && loading.export,
        disabled: exportDisabled
      });
    return (
      <Operation.List
        type={'default'}
        list={props.opts || defaultOpts}
        onOpt={(optKey) => {
          if (optKey === 'reset') {
            formRef.current?.reset();
            checkExportDisabled();
          }
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
    searchData,
    exportDisabled,
    checkExportDisabled
  ]);

  return (
    <div className={'ft-data-list-search'}>
      <OptForm
        ref={formRef}
        mode={'edit'}
        colNum={3}
        labelCol={props.labelCol}
        fields={props.list}
        onValueChange={(value) => {
          checkExportDisabled(value);
        }}
      />
      <div className={'ft-data-list-search-opt'}>{opts}</div>
    </div>
  );
}
