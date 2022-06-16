import React, { useMemo } from 'react';
import { Drawer as AntDrawer, Spin, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { Operation } from '../../index';
import type { OperationItemConfig } from '../../index';
import type { OptBoxProps, OptBoxDefaultOpt } from '../index';

export function Drawer(props: OptBoxProps) {
  const opts = useMemo(() => {
    if (props.opts === null) return null;
    const defaultOpts: OperationItemConfig<OptBoxDefaultOpt>[] = [
      {
        key: 'cancel',
        name: '取消',
        disabled: props.loading
      },
      {
        key: 'ok',
        name: '确定',
        type: 'primary',
        loading: props.loading,
        disabled: props.disabled
      }
    ];
    return (
      <Operation.List
        type={'default'}
        list={props.opts || defaultOpts}
        onOpt={props.onOpt}
      />
    );
  }, [props]);

  return (
    <AntDrawer
      closeIcon={
        <CloseOutlined
          className={props.loading ? 'ft-opt-box-close-disabled' : undefined}
        />
      }
      maskClosable={false}
      keyboard={false}
      destroyOnClose={props.destroyOnClose}
      title={props.title}
      visible={props.show}
      width={props.width}
      onClose={() => {
        if (props.loading) return;
        props.onOpt && props.onOpt('cancel');
      }}
      extra={opts}
    >
      <Spin
        wrapperClassName='ft-opt-box-spin'
        spinning={typeof props.spin === 'boolean' ? props.spin : false}
      >
        {props.children}
      </Spin>
    </AntDrawer>
  );
}
