import React, { useCallback, useMemo, useRef } from 'react';

import { OptForm, Operation } from '../../index';
import type {
  OptEditFormField,
  OptFormMethods,
  OperationItemConfig,
  RecordData
} from '../../index';

export interface DataListSearchProps<T extends RecordData = RecordData> {
  list: OptEditFormField<T>[];
  labelCol?: number | null;
  onSearch: (data: Partial<T>) => void;
}

type Opt = 'search' | 'reset';

export function Search(props: DataListSearchProps) {
  const formRef = useRef<OptFormMethods>(null);

  const searchData = useCallback(() => {
    const value = formRef.current?.getData();
    props.onSearch(value || {});
  }, [formRef, props]);

  const opts = useMemo<OperationItemConfig<Opt, Record<Opt, any>>[]>(
    () => [
      {
        key: 'search',
        name: '查询',
        type: 'primary'
      },
      {
        key: 'reset',
        name: '重置'
      }
    ],
    []
  );

  return (
    <div className={'ft-data-list-search'}>
      <OptForm
        ref={formRef}
        mode={'edit'}
        colNum={3}
        labelCol={props.labelCol}
        fields={props.list}
      />
      <div className={'ft-data-list-search-opt'}>
        <Operation.List
          type={'default'}
          list={opts}
          onOpt={(optKey) => {
            if (optKey === 'reset') formRef.current?.reset();
            searchData();
          }}
        />
      </div>
    </div>
  );
}
