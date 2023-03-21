import React, { memo, useMemo } from 'react';
import type { Key, ReactNode } from 'react';
import { Select, Switch } from 'antd';
import type { SelectProps, SwitchProps } from 'antd';

export interface StatusConfig<T = Key | boolean> {
  key: T;
  text: string;
}

export interface SelectStatusProps<T extends Key = Key> extends SelectProps {
  keys?: T[];
}

export interface SwitchStatusProps<T extends Key = Key>
  extends Omit<SwitchProps, 'onChange'> {
  value?: T;
  onChange?: (data: T | undefined) => void;
  keys?: T[];
}

export interface ShowStatusProps<T extends Key = Key> {
  value?: T;
  empty?: ReactNode;
}

export interface ShowStatusListProps<T extends Key = Key> {
  value?: T[];
  empty?: ReactNode;
  split?: string;
}

export function status<T extends Key = Key>(config: StatusConfig<T>[]) {
  const data: Map<T, string> = new Map();
  const keys: T[] = [];

  config
    .filter((item) => item)
    .forEach((item) => {
      keys.push(item.key);
      data.set(item.key, item.text);
    });

  const getStatusText = (params: { key?: T; empty?: ReactNode }): ReactNode => {
    if (params.key === undefined || params.key === null)
      return params.empty || '';
    return data.get(params.key) || '未知';
  };

  const SelectStatus = memo((props: SelectStatusProps<T>) => {
    return (
      <Select
        allowClear={true}
        placeholder={'请选择'}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        {...props}
      >
        {(props.keys || keys).map((item) => (
          <Select.Option key={item} value={item}>
            {getStatusText({ key: item })}
          </Select.Option>
        ))}
      </Select>
    );
  });

  const SwitchStatus = memo((props: SwitchStatusProps<T>) => {
    const allKeys = useMemo<T[]>(() => props.keys || keys, [props.keys]);

    const enableKey = useMemo(
      () => (allKeys.length > 1 ? allKeys[1] : allKeys[0]),
      [allKeys]
    );

    const disableKey = useMemo(
      () => (allKeys.length > 1 ? allKeys[0] : undefined),
      [allKeys]
    );

    return (
      <Switch
        checked={props.value === enableKey}
        onChange={(check) => {
          props.onChange && props.onChange(check ? enableKey : disableKey);
        }}
      />
    );
  });

  const ShowStatus = memo((props: ShowStatusProps<T>) => {
    return <>{getStatusText({ key: props.value, empty: props.empty })}</>;
  });

  const ShowStatusList = memo((props: ShowStatusListProps<T>) => {
    return (
      <>
        {props.value
          ? props.value
              .map((item) => getStatusText({ key: item, empty: props.empty }))
              .join(props.split || ',')
          : props.empty || ''}
      </>
    );
  });

  return { SelectStatus, SwitchStatus, ShowStatus, ShowStatusList };
}
