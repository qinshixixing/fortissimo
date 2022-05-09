export type RecordData = Record<string, any>;
export type KeyType<T extends RecordData> = Extract<keyof T, string>;
export type ValueType<T extends RecordData> = T[KeyType<T>];

export { Router } from './router';
export type { Route } from './router';

export * as Operation from './operation';
export type {
  OperationConfig,
  OperationProps,
  OperationItemConfig,
  OperationListProps
} from './operation';

export { OptForm } from './optForm';
export type {
  OptFormFieldDetail,
  OptFormField,
  OptEditFormField,
  OptFormFieldGroup,
  OptFormMode,
  OptFormProps,
  OptFormMethods
} from './optForm';
export type {
  OptFormField as FormField,
  OptEditFormField as EditFormField,
  OptFormFieldGroup as FormFieldGroup
} from './optForm';

export * as OptBox from './optBox';
export type { OptBoxDefaultOpt, OptBoxProps } from './optBox';

export { OptBoxPro } from './optBoxPro';
export type { OptBoxProType, OptBoxProProps } from './optBoxPro';

export * as DataList from './dataList';
export type {
  DataListOptConfig,
  DataListOptProps,
  DataListPageProps,
  DataListSearchProps,
  DataListRowData,
  DataListTableSortType,
  DataListTableMsg,
  DataListTableProps
} from './dataList';

export { DataListPro } from './dataListPro';
export type {
  DataListProMsgConfig,
  DataListProSearchConfig,
  DataListProOptPosition,
  DataListProOptConfig,
  DataListProOptParams,
  DataListProGetDataParams,
  DataListProGetDataRes,
  DataListProProps
} from './dataListPro';
export type {
  DataListProMsgConfig as DLMsg,
  DataListProSearchConfig as DLSearch,
  DataListProOptConfig as DLOpt,
  DataListProOptParams as DLOptParams,
  DataListProGetDataParams as DLGetParams,
  DataListProGetDataRes as DLGetRes
} from './dataListPro';
