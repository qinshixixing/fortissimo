import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo
} from 'react';
import type { ReactNode } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { trimString, checkFormItemEmpty } from '@fortissimo/util';
import type { SizeType } from 'antd/lib/config-provider/SizeContext';

import { DefaultShow } from './defaultShow';
import type { RecordData, KeyType, ValueType } from '../index';

export interface OptFormFieldDetail<K extends string = string, V = any> {
  key: K;
  isLayout?: boolean;
  name?: string;
  hide?: boolean;
  required?: boolean;
  component?: ReactNode;
  editComponent?: ReactNode;
  showComponent?: ReactNode;
  valuePropName?: string;
  editValuePropName?: string;
  showValuePropName?: string;
  defaultValue?: V;
  normalize?: (value: V, preValue: V) => V;
  validator?: (value: V) => string;
  linkValidatorKeys?: K[];
  width?: string | number;
  labelCol?: number;
  tip?: ReactNode;
  labelTip?: ReactNode;
}

export type OptFormField<T extends RecordData = RecordData> =
  OptFormFieldDetail<KeyType<T>, ValueType<T>>;

export type OptEditFormField<T extends RecordData = RecordData> = Partial<
  Omit<
    OptFormField<T>,
    | 'editComponent'
    | 'showComponent'
    | 'editValuePropName'
    | 'showValuePropName'
  >
> & { key: KeyType<T> };

export interface OptFormFieldGroup<T extends RecordData = RecordData> {
  title: string;
  fields: OptFormField<T>[];
}

export type OptFormMode = 'edit' | 'show';

export interface OptFormProps<T extends RecordData = RecordData> {
  className?: string;
  fields?: OptFormField<T>[];
  fieldGroups?: {
    title: string;
    fields: OptFormField<T>[];
  }[];
  labelCol?: number | null;
  colNum?: number;
  mode: OptFormMode;
  onValueChange?: (data: Partial<T>) => void;
  size?: SizeType;
}

export interface OptFormMethods<T extends RecordData = RecordData> {
  formRef: FormInstance;
  reset: () => void;
  check: () => void;
  getData: () => Partial<T>;
  setData: (data: Partial<T>) => void;
}

export const OptForm = forwardRef(function (
  {
    fields = [],
    fieldGroups = [],
    labelCol = 3,
    colNum = 1,
    mode,
    className,
    onValueChange,
    size
  }: OptFormProps,
  ref
) {
  const [formRef] = Form.useForm();

  const isShow = useMemo(() => mode === 'show', [mode]);

  useImperativeHandle(
    ref,
    (): OptFormMethods => ({
      formRef,
      reset: () => formRef.resetFields(),
      check: () => formRef.validateFields(),
      getData: () => trimString(formRef.getFieldsValue()),
      setData: (data) => formRef.setFieldsValue(data)
    })
  );

  const fieldItemContent = useCallback(
    (item: OptFormField) => {
      if (!isShow && item.editComponent) return item.editComponent;
      if (isShow && item.showComponent) return item.showComponent;
      return item.component || <DefaultShow />;
    },
    [isShow]
  );

  const valuePropName = useCallback(
    (item: OptFormField) => {
      if (!isShow && item.editValuePropName) return item.editValuePropName;
      if (isShow && item.showValuePropName) return item.showValuePropName;
      return item.valuePropName || 'value';
    },
    [isShow]
  );

  const fieldItems = useCallback(
    (list: OptFormField[]) => {
      const keyMap: Record<string, number> = {};
      return list.map((item, index) => {
        if (!keyMap[item.key]) keyMap[item.key] = 1;
        else keyMap[item.key] = keyMap[item.key] + 1;
        const key = `${item.key}${keyMap[item.key]}`;
        return (
          <div
            className={'ft-opt-form-item' + (item.hide ? ' hide' : '')}
            key={item.key ? key : index}
            style={{
              width: item.width || `${100 / colNum}%`
            }}
          >
            <Form.Item
              name={item.isLayout ? undefined : item.key && String(item.key)}
              label={item.name || ''}
              hidden={item.hide}
              labelCol={
                typeof item.labelCol === 'number'
                  ? { span: item.labelCol }
                  : undefined
              }
              wrapperCol={
                typeof item.labelCol === 'number'
                  ? { span: 24 - item.labelCol }
                  : undefined
              }
              required={isShow ? false : item.required}
              normalize={isShow ? undefined : item.normalize}
              initialValue={item.defaultValue}
              valuePropName={valuePropName(item)}
              extra={item.tip}
              tooltip={item.labelTip}
              dependencies={item.linkValidatorKeys}
              rules={
                isShow
                  ? undefined
                  : [
                      {
                        validator: (rule: any, checkValue: any) => {
                          const value = checkValue;
                          if (item.required && checkFormItemEmpty(value)) {
                            return Promise.reject(`${item.name}不能为空！`);
                          }
                          if (item.validator) {
                            const result = item.validator(value);
                            if (result) return Promise.reject(result);
                          }
                          return Promise.resolve('');
                        }
                      }
                    ]
              }
            >
              {fieldItemContent(item)}
            </Form.Item>
          </div>
        );
      });
    },
    [colNum, isShow, fieldItemContent, valuePropName]
  );

  return (
    <Form
      className={className}
      form={formRef}
      labelWrap
      size={size}
      labelCol={typeof labelCol === 'number' ? { span: labelCol } : undefined}
      wrapperCol={
        typeof labelCol === 'number' ? { span: 24 - labelCol } : undefined
      }
      preserve={false}
      onValuesChange={(changedValues, values) => {
        onValueChange && onValueChange(values);
      }}
    >
      {fieldItems(fields)}
      {fieldGroups.map((group, index) => (
        <div key={index}>
          <div className={'ft-opt-form-title'}>{group.title}</div>
          {fieldItems(group.fields || [])}
        </div>
      ))}
    </Form>
  );
});
