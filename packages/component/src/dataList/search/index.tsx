import React, { useCallback, useMemo, useRef } from 'react';

import { OptForm, Operation } from '../../index';
import type {
  EditFormFieldList,
  FormData,
  OptFormMethods,
  OperationItemConfig
} from '../../index';

export interface DataListSearchProps<T extends FormData = FormData> {
  list: EditFormFieldList<T>;
  onSearch: (data: Partial<T>) => void;
}

type Opt = 'search' | 'reset';

export function Search<T extends FormData = FormData>(
  props: DataListSearchProps<T>
) {
  const formRef = useRef<OptFormMethods<T>>(null);

  const searchData = useCallback(() => {
    const value = formRef.current?.getData();
    props.onSearch(value || {});
  }, [formRef, props]);

  const opts = useMemo<OperationItemConfig<Opt, T>[]>(
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
    <>
      <OptForm
        ref={formRef}
        mode={'edit'}
        className={'ft-data-list-search'}
        colNum={3}
        fields={props.list}
      />
      <Operation.List
        type={'default'}
        list={opts}
        onOpt={(optKey) => {
          if (optKey === 'reset') formRef.current?.reset();
          searchData();
        }}
      />
    </>
  );
}
