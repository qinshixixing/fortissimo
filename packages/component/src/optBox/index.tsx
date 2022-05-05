import type { ReactNode } from 'react';
import type { OperationItemConfig } from '../index';

export type OptBoxDefaultOpt = 'ok' | 'cancel';

export interface OptBoxProps<K extends string = OptBoxDefaultOpt> {
  show: boolean;
  width?: number | string;
  title?: ReactNode;
  opts?: OperationItemConfig<K>[];
  onOpt?: (optKey: K | OptBoxDefaultOpt) => void;
  children?: ReactNode;
  destroyOnClose?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

export { Modal } from './modal';
export { Drawer } from './drawer';
