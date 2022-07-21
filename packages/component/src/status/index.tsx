import React, { memo, useMemo } from 'react';
import type { Key } from 'react';
import { Select, Switch } from 'antd';
import type { SelectProps, SwitchProps } from 'antd';

export interface StatusConfig<T extends Key = string> {
  key: T;
  text: string;
}

export interface SelectStatusProps<T extends Key = string> extends SelectProps {
  keys?: T[];
}

export interface SwitchStatusProps<T extends Key = string>
  extends Omit<SwitchProps, 'onChange'> {
  value?: T;
  onChange?: (data: T | undefined) => void;
  keys?: T[];
}

export interface ShowStatusProps<T extends Key = string> {
  value?: T;
}

export function status<T extends Key = string>(config: StatusConfig<T>[]) {
  const data: Map<T, string> = new Map();
  const keys: T[] = [];

  config.forEach((item) => {
    keys.push(item.key);
    data.set(item.key, item.text);
  });

  const getStatusText = (status?: T): string => {
    if (status === undefined) return '未知';
    return data.get(status) || '未知';
  };

  const SelectStatus = memo((props: SelectStatusProps<T>) => {
    return (
      <Select
        placeholder={'请选择'}
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        {...props}
      >
        {(props.keys || keys).map((item) => (
          <Select.Option key={item} value={item}>
            {getStatusText(item)}
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
    return <>{getStatusText(props.value)}</>;
  });

  return { SelectStatus, SwitchStatus, ShowStatus };
}
