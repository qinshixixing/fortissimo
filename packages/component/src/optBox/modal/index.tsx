import React from 'react';
import { Modal as AntModal, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import type { OptBoxProps } from '../index';
import { useOpts } from '../useOpts';

export function Modal(props: OptBoxProps) {
  const { defaultOptsConfig, opts } = useOpts({
    okOpt: props.okOpt,
    cancelOpt: props.cancelOpt,
    opts: props.opts,
    onOpt: props.onOpt,
    size: props.size
  });

  return (
    <AntModal
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
      onCancel={() => {
        if (defaultOptsConfig.cancel?.disabled) return;
        props.onOpt && props.onOpt('cancel');
      }}
      footer={opts}
      modalRender={(node) => (
        <Spin
          wrapperClassName='ft-opt-box-spin'
          spinning={typeof props.spin === 'boolean' ? props.spin : false}
        >
          {node}
        </Spin>
      )}
    >
      {props.children}
    </AntModal>
  );
}
