import React, {
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  useEffect
} from 'react';
import type { ReactNode } from 'react';
import { checkFormEmpty } from '@fortissimo/util';

import { OptForm, OptBox, globalDefaultConfig, globalConfig } from '../index';
import type {
  OptFormProps,
  OptBoxProps,
  OptFormMethods,
  OptBoxDefaultOpt,
  RecordData
} from '../index';

export type OptBoxProType = 'modal' | 'drawer';

type OptBoxProFormProps<T extends RecordData = RecordData> = Pick<
  OptFormProps<T>,
  'mode' | 'labelCol' | 'colNum' | 'fields' | 'fieldGroups' | 'size' | 'layout'
>;
type OptBoxProBoxProps = Pick<OptBoxProps, 'show' | 'width' | 'title'>;

export interface OptBoxProProps<T extends RecordData = RecordData>
  extends OptBoxProFormProps<T>,
    OptBoxProBoxProps {
  content?: ReactNode;
  extraContent?: ReactNode;
  type?: OptBoxProType;
  onClose?: () => void;
  onConfirm?: (data?: Partial<T>) => Promise<void> | void;
  onConfirmBefore?: (data?: Partial<T>) => Promise<void> | void;
  disableOnEmpty?: boolean;
  spin?: boolean;
  hideOpts?: boolean;
  hideCancel?: boolean;
}

export const OptBoxPro = forwardRef(function (props: OptBoxProProps, ref) {
  const optFormRef = useRef<OptFormMethods>(null);

  const [loading, setLoading] = useState(false);

  const isShow = useMemo(() => props.mode === 'show', [props.mode]);

  const [confirmDisabled, setConfirmDisabled] = useState(false);
  useEffect(() => {
    if (!props.disableOnEmpty) setConfirmDisabled(false);
    else setConfirmDisabled(checkFormEmpty(optFormRef.current?.getData()));
  }, [props.disableOnEmpty]);

  const handleOpt = useCallback(
    async (optKey: OptBoxDefaultOpt) => {
      if (optKey === 'cancel') {
        if (props.onClose) props.onClose();
      }
      if (optKey === 'ok') {
        if (optFormRef.current) {
          await optFormRef.current.check();
          setLoading(true);
          try {
            if (props.onConfirmBefore)
              await props.onConfirmBefore(optFormRef.current.getData());
            if (props.onConfirm)
              await props.onConfirm(optFormRef.current.getData());
          } catch (e) {
            // error
          }
          setLoading(false);
        } else {
          setLoading(true);
          if (props.onConfirmBefore) await props.onConfirmBefore();
          if (props.onConfirm) await props.onConfirm();
          setLoading(false);
        }
      }
    },
    [props, optFormRef]
  );

  useImperativeHandle(
    ref,
    () => ({
      formRef: () => optFormRef.current && optFormRef.current.formRef,
      getData: () => optFormRef.current && optFormRef.current.getData(),
      reset: () => optFormRef.current && optFormRef.current.reset(),
      check: () => optFormRef.current && optFormRef.current.check(),
      setData: (data: Partial<Record<string, any>>) => {
        if (optFormRef.current) optFormRef.current.setData(data);
        else
          setTimeout(() => {
            optFormRef.current && optFormRef.current.setData(data);
          }, 100);
      }
    }),
    []
  );

  const width = useMemo(
    () =>
      globalConfig.optBoxProWidth ||
      props.width ||
      globalDefaultConfig.optBoxProWidth ||
      500,
    [props.width]
  );

  const realType = useMemo<OptBoxProType>(
    () =>
      globalConfig.optBoxProType ||
      props.type ||
      globalDefaultConfig.optBoxProType ||
      'modal',
    [props.type]
  );

  const Box = realType === 'drawer' ? OptBox.Drawer : OptBox.Modal;

  return (
    <Box
      show={props.show}
      destroyOnClose
      title={props.title}
      width={width}
      onOpt={async (optKey) => {
        await handleOpt(optKey as OptBoxDefaultOpt);
      }}
      hideCloseIcon={props.hideCancel}
      okOpt={
        props.hideOpts || isShow
          ? null
          : { loading: loading, disabled: confirmDisabled }
      }
      cancelOpt={
        props.hideOpts || props.hideCancel
          ? null
          : { disabled: loading, ...(isShow ? { name: '确定' } : {}) }
      }
      spin={props.spin && loading}
      size={props.size}
    >
      {props.content || (
        <OptForm
          ref={optFormRef}
          mode={props.mode}
          labelCol={props.labelCol}
          colNum={props.colNum}
          fields={props.fields}
          fieldGroups={props.fieldGroups}
          size={props.size}
          layout={props.layout}
          onValueChange={(data) => {
            if (!props.disableOnEmpty) return;
            setConfirmDisabled(checkFormEmpty(data));
          }}
        />
      )}
      {props.extraContent}
    </Box>
  );
});
