import type { OperationItemConfig } from '../index';

export type DataListOptConfig<
  K extends string = string,
  DK extends string = string,
  DV = any
> = Omit<OperationItemConfig<K, Record<DK, DV>>, 'type' | 'data'>;

export interface DataListOptProps<
  K extends string = string,
  DK extends string = string,
  DV = any
> {
  list: DataListOptConfig<K, DK, DV>[];
  onOpt?: (key: K) => void;
  data?: Record<DK, DV>;
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
