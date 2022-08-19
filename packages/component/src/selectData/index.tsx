import type { RecordData, KeyType, ValueType } from '../index';
import type { SelectProps } from 'antd';

export interface SelectDataConfig<T extends RecordData = RecordData>
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'onSearch' | 'options' | 'optionFilterProp'
  > {
  itemKey?: KeyType<T>;
  itemText?: KeyType<T>;
  itemChildren?: KeyType<T>;
  hasChildren?: boolean;
  onGetData?: (
    searchValue?: string,
    item?: number,
    parentValue?: ValueType<T>
  ) => Promise<T[]>;
  searchFromServer?: boolean;
}

export { Item } from './item';
export type { SelectDataItemProps } from './item';

export { Link } from './link';
export type { SelectDataLinkProps } from './link';
