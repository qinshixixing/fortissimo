import React, { useMemo } from 'react';
import { Drawer as AntDrawer } from 'antd';

import { Operation } from '../../index';
import type { OperationItemConfig } from '../../index';
import type { OptBoxProps, OptBoxDefaultOpt } from '../index';

export function Drawer<K extends string = OptBoxDefaultOpt>(
  props: OptBoxProps<K>
) {
  const opts = useMemo(() => {
    if (props.opts === null) return null;
    const opts: OperationItemConfig<K | OptBoxDefaultOpt>[] = props.opts || [
      {
        key: 'cancel',
        name: '取消'
      },
      {
        key: 'ok',
        name: '确定',
        type: 'primary',
        loading: props.loading,
        disabled: props.disabled
      }
    ];
    return <Operation.List type={'default'} list={opts} onOpt={props.onOpt} />;
  }, [props]);

  return (
    <AntDrawer
      maskClosable={false}
      keyboard={false}
      destroyOnClose={props.destroyOnClose}
      title={props.title}
      visible={props.show}
      width={props.width}
      onClose={() => {
        props.onOpt && props.onOpt('cancel');
      }}
      extra={opts}
    >
      {props.children}
    </AntDrawer>
  );
}
