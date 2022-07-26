import type { RecordData, KeyType } from '../index';
import type { SelectProps } from 'antd';

export interface SelectDataConfig<T extends RecordData = RecordData>
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'onSearch' | 'options' | 'optionFilterProp'
  > {
  itemKey?: KeyType<T>;
  itemText?: KeyType<T>;
  onGetData: (searchValue?: string, firstSelectvalue?: any) => Promise<T[]>;
  searchFromServer?: boolean;
  searchFromServerWhileEmpty?: boolean;
}

export { Item } from './item';
export type { SelectDataItemProps } from './item';

export { Link } from './link';
export type { SelectDataLinkProps } from './link';
