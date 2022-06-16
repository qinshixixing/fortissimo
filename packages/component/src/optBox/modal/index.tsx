import React, { useMemo } from 'react';
import { Modal as AntModal, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { Operation } from '../../index';
import type { OptBoxProps } from '../index';

export function Modal(props: OptBoxProps) {
  const footer = useMemo(() => {
    if (props.opts)
      return (
        <Operation.List
          type={'default'}
          list={props.opts}
          onOpt={props.onOpt}
        />
      );
    else if (props.opts === null) return null;
    return undefined;
  }, [props]);

  return (
    <AntModal
      closeIcon={<CloseOutlined disabled={props.loading} />}
      maskClosable={false}
      keyboard={false}
      destroyOnClose={props.destroyOnClose}
      title={props.title}
      visible={props.show}
      width={props.width}
      onCancel={() => {
        props.onOpt && props.onOpt('cancel');
      }}
      onOk={() => {
        props.onOpt && props.onOpt('ok');
      }}
      okButtonProps={{
        disabled: props.disabled,
        loading: props.loading
      }}
      cancelButtonProps={{
        disabled: props.loading
      }}
      footer={footer}
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
