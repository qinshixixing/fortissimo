import type { ReactNode } from 'react';
import type { ButtonType } from 'antd/es/button';

export interface OperationConfig<T = any> {
  className?: string;
  name?: string | ((data?: T) => string);
  defaultName?: string;
  type?: ButtonType;
  icon?: ReactNode;
  hide?: boolean | ((data?: T) => boolean);
  disabled?: boolean | ((data?: T) => boolean);
  loading?: boolean | ((data?: T) => boolean);
  data?: T;
}

export interface OperationProps<T = any> extends OperationConfig<T> {
  onOpt?: () => void;
}

export interface OperationItemConfig<K extends string = string, T = any>
  extends OperationConfig<T> {
  key: K;
}

export interface OperationListProps<K extends string = string, T = any> {
  className?: string;
  type?: ButtonType;
  list?: OperationItemConfig<K, T>[];
  data?: T;
  onOpt?: (key: K) => void;
}

export { Item } from './item';

export { List } from './list';
