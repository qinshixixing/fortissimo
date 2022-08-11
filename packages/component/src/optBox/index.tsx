import type { ReactNode } from 'react';
import type { OperationItemConfig } from '../index';

export type OptBoxDefaultOpt = 'ok' | 'cancel';

export interface OptBoxProps<K extends string = string> {
  show: boolean;
  width?: number | string;
  title?: ReactNode;
  opts?: OperationItemConfig<K>[] | null;
  onOpt?: (optKey: K) => void;
  okOpt?: Omit<OperationItemConfig<OptBoxDefaultOpt>, 'key'> | null;
  cancelOpt?: Omit<OperationItemConfig<OptBoxDefaultOpt>, 'key'> | null;
  children?: ReactNode;
  destroyOnClose?: boolean;
  spin?: boolean;
  size?: OperationItemConfig['size'];
}

export { Modal } from './modal';
export { Drawer } from './drawer';
