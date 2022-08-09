import React from 'react';
import { Drawer as AntDrawer, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import type { OptBoxProps } from '../index';
import { useOpts } from '../useOpts';

export function Drawer(props: OptBoxProps) {
  const { defaultOptsConfig, opts } = useOpts({
    okOpt: props.okOpt,
    cancelOpt: props.cancelOpt,
    opts: props.opts,
    onOpt: props.onOpt
  });

  return (
    <AntDrawer
      closable={Boolean(defaultOptsConfig.cancel)}
      closeIcon={
        <CloseOutlined
          className={
            defaultOptsConfig.cancel?.disabled
              ? 'ft-opt-box-close-disabled'
              : undefined
          }
        />
      }
      maskClosable={false}
      keyboard={false}
      destroyOnClose={props.destroyOnClose}
      title={props.title}
      visible={props.show}
      width={props.width}
      onClose={() => {
        if (defaultOptsConfig.cancel?.disabled) return;
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
