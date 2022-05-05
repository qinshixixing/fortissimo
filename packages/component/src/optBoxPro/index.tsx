import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import type { ReactNode } from 'react';

import { OptForm, OptBox } from '../index';
import type {
  OptFormProps,
  OptBoxProps,
  OptFormMethods,
  OptBoxDefaultOpt
} from '../index';

export type OptBoxProType = 'modal' | 'drawer';

type OptBoxProFormProps<K extends string = string, V = any> = Omit<
  OptFormProps<K, V>,
  'className'
>;
type OptBoxProBoxProps = Pick<OptBoxProps, 'show' | 'width' | 'title'>;

export interface OptBoxProProps<K extends string = string, V = any>
  extends OptBoxProFormProps<K, V>,
    OptBoxProBoxProps {
  content?: ReactNode;
  extraContent?: ReactNode;
  type?: OptBoxProType;
  onClose: () => void;
  onConfirm: (data: Partial<Record<K, V>>) => Promise<void> | void;
  onConfirmBefore?: (data: Partial<Record<K, V>>) => Promise<void> | void;
}

export const OptBoxPro = forwardRef(function (props: OptBoxProProps, ref) {
  const formRef = useRef<OptFormMethods>(null);

  const [loading, setLoading] = useState(false);

  const isShow = useMemo(() => props.mode === 'show', [props.mode]);

  const handleOpt = useCallback(
    async (optKey: OptBoxDefaultOpt) => {
      if (optKey === 'cancel') {
        props.onClose();
      }
      if (optKey === 'ok' && formRef.current) {
        await formRef.current.check();
        setLoading(true);
        try {
          if (props.onConfirmBefore)
            await props.onConfirmBefore(formRef.current.getData());
          await props.onConfirm(formRef.current.getData());
        } catch (e) {
          // error
        }
        setLoading(false);
      }
    },
    [props, formRef]
  );

  useImperativeHandle(ref, () => ({
    getData: () => formRef.current && formRef.current.getData(),
    setData: (data: Partial<Record<string, any>>) => {
      if (formRef.current) formRef.current.setData(data);
      else
        setTimeout(() => {
          formRef.current && formRef.current.setData(data);
        }, 100);
    }
  }));

  const Box = props.type === 'drawer' ? OptBox.Drawer : OptBox.Modal;

  return (
    <Box
      show={props.show}
      destroyOnClose
      title={props.title}
      width={props.width || 500}
      opts={isShow ? [{ key: 'cancel', name: '确定', loading }] : undefined}
      onOpt={async (optKey) => {
        await handleOpt(optKey as OptBoxDefaultOpt);
      }}
      loading={loading}
    >
      {props.content || (
        <OptForm
          ref={formRef}
          mode={props.mode}
          labelCol={props.labelCol}
          colNum={props.colNum}
          fields={props.fields}
          fieldGroups={props.fieldGroups}
        />
      )}
      {props.extraContent}
    </Box>
  );
});
