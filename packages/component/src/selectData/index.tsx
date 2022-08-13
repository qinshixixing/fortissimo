import type { RecordData, KeyType, ValueType } from '../index';
import type { SelectProps } from 'antd';

export interface SelectDataOptionConfig<T extends RecordData = RecordData> {
  label: ValueType<T>;
  value: ValueType<T>;
  itemData: Partial<T>;
}

export interface SelectDataConfig<T extends RecordData = RecordData>
  extends Omit<
    SelectProps,
    'value' | 'onChange' | 'onSearch' | 'options' | 'optionFilterProp'
  > {
  itemKey?: KeyType<T>;
  itemText?: KeyType<T>;
  onGetData: (
    searchValue?: string,
    firstSelectValue?: ValueType<T>
  ) => Promise<T[]>;
  searchFromServer?: boolean;
  searchFromServerWhileEmpty?: boolean;
}

export { Item } from './item';
export type { SelectDataItemProps } from './item';

export { Link } from './link';
export type { SelectDataLinkProps } from './link';
