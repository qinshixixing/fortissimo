import React, {
  useCallback,
  useMemo,
  useRef,
  useImperativeHandle,
  forwardRef
} from 'react';

import { OptForm, Operation, OptBoxDefaultOpt } from '../../index';
import type {
  OptFormMethods,
  OperationItemConfig,
  RecordData,
  OptFormProps
} from '../../index';

export type DataListSearchDefaultOpt = 'search' | 'reset' | 'export';

type DataListSearchFormProps<T extends RecordData = RecordData> = Pick<
  OptFormProps<T>,
  'labelCol' | 'fields' | 'size' | 'onValueChange'
>;
export interface DataListSearchProps<T extends RecordData = RecordData>
  extends DataListSearchFormProps {
  inlineOpt?: boolean;
  opts?: OperationItemConfig[] | null;
  searchOpt?: Omit<OperationItemConfig<OptBoxDefaultOpt>, 'key'> | null;
  resetOpt?: Omit<OperationItemConfig<OptBoxDefaultOpt>, 'key'> | null;
  exportOpt?: Omit<OperationItemConfig<OptBoxDefaultOpt>, 'key'> | null;
  onOpt: (data: Partial<T>, optKey: string) => void;
}

export const Search = forwardRef(function (props: DataListSearchProps, ref) {
  const formRef = useRef<OptFormMethods>(null);

  const handleOpt = useCallback(
    (optKey: string) => {
      if (props.opts !== null) {
        if (optKey === 'reset') formRef.current?.reset();
      }
      const value = formRef.current?.getData();
      props.onOpt(value || {}, optKey);
    },
    [props]
  );

  useImperativeHandle(ref, () => ({
    getData: () => formRef.current && formRef.current.getData(),
    reset: () => formRef.current && formRef.current.reset(),
    check: () => formRef.current && formRef.current.check(),
    setData: (data: Partial<Record<string, any>>) => {
      if (formRef.current) formRef.current.setData(data);
      else
        setTimeout(() => {
          formRef.current && formRef.current.setData(data);
        }, 100);
    }
  }));

  const opts = useMemo(() => {
    if (props.opts === null) return null;
    const data: OperationItemConfig<DataListSearchDefaultOpt>[] = [];

    if (props.searchOpt !== null)
      data.push({
        key: 'search',
        name: '查询',
        type: 'primary',
        ...props.searchOpt
      });
    if (props.resetOpt !== null)
      data.push({
        key: 'reset',
        name: '重置',
        ...props.resetOpt
      });
    if (props.exportOpt !== null)
      data.push({
        key: 'export',
        name: '导出',
        ...props.exportOpt
      });
    return (
      <Operation.List
        type={'default'}
        size={props.size}
        list={props.opts || data}
        onOpt={handleOpt}
      />
    );
  }, [
    props.opts,
    props.searchOpt,
    props.resetOpt,
    props.exportOpt,
    props.size,
    handleOpt
  ]);

  const fields = useMemo(() => {
    if (!props.inlineOpt) return props.fields;
    return [
      ...(props.fields || []),
      {
        key: 'opt',
        name: '',
        labelCol: 0,
        isLayout: true,
        component: () => opts
      }
    ];
  }, [opts, props.fields, props.inlineOpt]);

  return (
    <div className={'ft-data-list-search'}>
      <OptForm
        ref={formRef}
        mode={'edit'}
        colNum={3}
        labelCol={props.labelCol}
        fields={fields}
        onValueChange={props.onValueChange}
        size={props.size}
      />
      {!props.inlineOpt && (
        <div className={'ft-data-list-search-opt'}>{opts}</div>
      )}
    </div>
  );
});
