import React, { useCallback, useMemo, useRef } from 'react';

import { OptForm, Operation } from '../../index';
import type {
  EditFormField,
  OptFormMethods,
  OperationItemConfig
} from '../../index';

export interface DataListSearchProps<K extends string = string, V = any> {
  list: EditFormField<K, V>[];
  onSearch: (data: Partial<Record<K, V>>) => void;
}

type Opt = 'search' | 'reset';

export function Search(props: DataListSearchProps<string, any>) {
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
      <OptForm ref={formRef} mode={'edit'} colNum={3} fields={props.list} />
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
