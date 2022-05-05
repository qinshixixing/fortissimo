import React, { useMemo } from 'react';
import { Button } from 'antd';
import type { OperationProps } from '../index';

export function Item(props: OperationProps) {
  const defaultName = useMemo(
    () => (typeof props.defaultName === 'string' ? props.defaultName : '确定'),
    [props.defaultName]
  );

  const name = useMemo<string>(() => {
    if (typeof props.name === 'string') return props.name;
    if (props.name) return props.name(props.data);
    return defaultName;
  }, [props, defaultName]);

  const hide = useMemo<boolean>(() => {
    if (typeof props.hide === 'boolean') return props.hide;
    if (props.hide) return props.hide(props.data);
    return false;
  }, [props]);

  const disabled = useMemo<boolean>(() => {
    if (typeof props.disabled === 'boolean') return props.disabled;
    if (props.disabled) return props.disabled(props.data);
    return false;
  }, [props]);

  const loading = useMemo<boolean>(() => {
    if (typeof props.loading === 'boolean') return props.loading;
    if (props.loading) return props.loading(props.data);
    return false;
  }, [props]);

  return hide ? (
    <></>
  ) : (
    <Button
      className={props.className}
      type={props.type}
      icon={props.icon}
      disabled={disabled}
      loading={loading}
      onClick={() => {
        props.onOpt && props.onOpt();
      }}
    >
      {name}
    </Button>
  );
}
