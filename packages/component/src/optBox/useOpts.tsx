import React, { useMemo } from 'react';
import { Operation, OperationItemConfig } from '../index';
import type { OptBoxProps, OptBoxDefaultOpt } from './index';

export function useOpts(
  params: Pick<OptBoxProps, 'opts' | 'okOpt' | 'cancelOpt' | 'onOpt'>
) {
  const defaultOptsConfig = useMemo<
    Partial<Record<OptBoxDefaultOpt, OperationItemConfig<OptBoxDefaultOpt>>>
  >(() => {
    const data: Partial<
      Record<OptBoxDefaultOpt, OperationItemConfig<OptBoxDefaultOpt>>
    > = {};
    if (params.okOpt !== null)
      data.ok = {
        key: 'ok',
        name: '确定',
        type: 'primary',
        ...params.okOpt
      };
    if (params.cancelOpt !== null)
      data.cancel = {
        key: 'cancel',
        name: '取消',
        ...params.cancelOpt
      };
    return data;
  }, [params.okOpt, params.cancelOpt]);

  const opts = useMemo(() => {
    if (params.opts === null) return null;

    const defaultOpts: OperationItemConfig<OptBoxDefaultOpt>[] = [];

    if (defaultOptsConfig.cancel) defaultOpts.push(defaultOptsConfig.cancel);
    if (defaultOptsConfig.ok) defaultOpts.push(defaultOptsConfig.ok);

    return (
      <Operation.List
        type={'default'}
        list={params.opts || defaultOpts}
        onOpt={params.onOpt}
      />
    );
  }, [
    params.opts,
    params.onOpt,
    defaultOptsConfig.cancel,
    defaultOptsConfig.ok
  ]);

  return {
    defaultOptsConfig,
    opts
  };
}
