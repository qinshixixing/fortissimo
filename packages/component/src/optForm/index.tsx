import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo
} from 'react';
import type { ReactNode } from 'react';
import { Form } from 'antd';
import { trimString } from '@fortissimo/util';

import { DefaultShow } from './defaultShow';
import type { RecordData, KeyType, ValueType } from '../index';

export interface OptFormFieldDetail<K extends string = string, V = any> {
  key: K;
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
}

export interface OptFormMethods<T extends RecordData = RecordData> {
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
    className
  }: OptFormProps,
  ref
) {
  const [formRef] = Form.useForm();

  const isShow = useMemo(() => mode === 'show', [mode]);

  useImperativeHandle(
    ref,
    (): OptFormMethods => ({
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
    (list: OptFormField[]) =>
      list.map((item, index) => (
        <div
          className={'ft-opt-form-item' + (item.hide ? ' hide' : '')}
          key={item.key ? String(item.key) : index}
          style={{
            width: item.width || `${100 / colNum}%`
          }}
        >
          <Form.Item
            name={item.key && String(item.key)}
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
            rules={
              isShow
                ? undefined
                : [
                    {
                      validator: (rule: any, checkValue: any) => {
                        let value = checkValue;
                        if (typeof value === 'string')
                          value = checkValue.trim();
                        const isEmpty = !value && value !== 0;
                        if (item.required) {
                          if (
                            isEmpty ||
                            (Array.isArray(value) && !value.length)
                          )
                            return Promise.reject(`${item.name}???????????????`);
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
      )),
    [colNum, isShow, fieldItemContent, valuePropName]
  );

  return (
    <Form
      className={className}
      form={formRef}
      labelWrap
      labelCol={typeof labelCol === 'number' ? { span: labelCol } : undefined}
      wrapperCol={
        typeof labelCol === 'number' ? { span: 24 - labelCol } : undefined
      }
      preserve={false}
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
