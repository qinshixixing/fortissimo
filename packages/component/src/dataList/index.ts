import type { OperationItemConfig } from '../index';
import type { DataListRowData } from './table';

export type DataListOptConfig<
  K extends string = string,
  T extends DataListRowData = DataListRowData
> = Omit<OperationItemConfig<K, T>, 'type' | 'data'>;

export interface DataListOptProps<
  K extends string = string,
  T extends DataListRowData = DataListRowData
> {
  list: DataListOptConfig<K, T>[];
  onOpt?: (key: K) => void;
  data?: T;
}

export { RowOpt } from './rowOpt';
export { HeaderOpt } from './headerOpt';

export { Page } from './page';
export type { DataListPageProps } from './page';

export { Search } from './search';
export type { DataListSearchProps } from './search';

export { Table } from './table';
export type {
  DataListRowData,
  DataListTableSortType,
  DataListTableMsg,
  DataListTableProps
} from './table';
