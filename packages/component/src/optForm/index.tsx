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

export interface FormField<K extends string = string, V = any> {
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
}

export type EditFormField<K extends string = string, V = any> = Omit<
  FormField<K, V>,
  'editComponent' | 'showComponent' | 'editValuePropName' | 'showValuePropName'
>;

export interface FormFieldGroup<K extends string = string, V = any> {
  title: string;
  fields: FormField<K, V>[];
}

export type FormMode = 'edit' | 'show';

export interface OptFormProps<K extends string = string, V = any> {
  className?: string;
  fields?: FormField<K, V>[];
  fieldGroups?: FormFieldGroup<K, V>[];
  labelCol?: number;
  colNum?: number;
  mode: FormMode;
}

export interface OptFormMethods<K extends string = string, V = any> {
  reset: () => void;
  check: () => void;
  getData: () => Partial<Record<K, V>>;
  setData: (data: Partial<Record<K, V>>) => void;
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
    (item: FormField) => {
      if (!isShow && item.editComponent) return item.editComponent;
      if (isShow && item.showComponent) return item.showComponent;
      return item.component || <DefaultShow />;
    },
    [isShow]
  );

  const valuePropName = useCallback(
    (item: FormField) => {
      if (!isShow && item.editValuePropName) return item.editValuePropName;
      if (isShow && item.showValuePropName) return item.showValuePropName;
      return item.valuePropName || 'value';
    },
    [isShow]
  );

  const fieldItems = useCallback(
    (list: FormField[]) =>
      list.map((item, index) => (
        <Form.Item
          className={'ft-opt-form-item'}
          key={item.key ? String(item.key) : index}
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
          style={{
            width: item.width || `${100 / colNum}%`
          }}
          initialValue={item.defaultValue}
          valuePropName={valuePropName(item)}
          rules={
            isShow
              ? undefined
              : [
                  {
                    validator: (rule: any, checkValue: any) => {
                      let value = checkValue;
                      if (typeof value === 'string') value = checkValue.trim();
                      const isEmpty = !value && value !== 0;
                      if (item.required) {
                        if (isEmpty || (Array.isArray(value) && !value.length))
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
      )),
    [colNum, isShow, fieldItemContent, valuePropName]
  );

  return (
    <Form
      className={className}
      form={formRef}
      labelWrap
      labelCol={{ span: labelCol }}
      wrapperCol={{ span: 24 - labelCol }}
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
