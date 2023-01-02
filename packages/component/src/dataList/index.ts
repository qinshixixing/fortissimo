import type { OperationItemConfig } from '../index';

export type DataListOptConfig<K extends string = string, T = any> = Omit<
  OperationItemConfig<K, T>,
  'type' | 'data'
>;

export interface DataListOptProps<K extends string = string, T = any> {
  list: DataListOptConfig<K, T>[];
  emptyText?: string;
  onOpt?: (key: K) => void;
  data?: T;
  size?: OperationItemConfig['size'];
}

export { RowOpt } from './rowOpt';
export { HeaderOpt } from './headerOpt';

export { Page } from './page';
export type { DataListPageProps } from './page';

export { Search } from './search';
export type { DataListSearchProps, DataListSearchDefaultOpt } from './search';

export { Table } from './table';
export type {
  DataListRowData,
  DataListTableSortType,
  DataListTableMsg,
  DataListTableProps
} from './table';

export { List } from './list';
export type { DataListListProps } from './list';
