import { OptFormProps } from './optForm';
import { OptBoxProProps } from './optBoxPro';

export interface GlobalConfig {
  optFormColNum: OptFormProps['colNum'];
  optBoxProType: OptBoxProProps['type'];
  optBoxProWidth: OptBoxProProps['width'];
}

export const globalConfig: Partial<GlobalConfig> = {};
export const globalDefaultConfig: Partial<GlobalConfig> = {};

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
  DataListSearchDefaultOpt,
  DataListRowData,
  DataListTableSortType,
  DataListTableMsg,
  DataListTableProps,
  DataListListProps
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

export { DataListProLocal } from './dataListProLocal';
export type {
  DataListProLocalMsgConfig,
  DataListProLocalSearchConfig,
  DataListProLocalOptPosition,
  DataListProLocalOptConfig,
  DataListProLocalOptParams,
  DataListProLocalGetDataParams,
  DataListProLocalGetDataRes,
  DataListProLocalProps
} from './dataListProLocal';
export type {
  DataListProLocalMsgConfig as DLLMsg,
  DataListProLocalSearchConfig as DLLSearch,
  DataListProLocalOptConfig as DLLOpt,
  DataListProLocalOptParams as DLLOptParams,
  DataListProLocalGetDataParams as DLLGetParams,
  DataListProLocalGetDataRes as DLLGetRes
} from './dataListProLocal';

export { DataListProAll } from './dataListProAll';
export type {
  DataListProAllMsgConfig,
  DataListProAllSearchConfig,
  DataListProAllOptPosition,
  DataListProAllOptConfig,
  DataListProAllOptParams,
  DataListProAllGetDataParams,
  DataListProAllGetDataRes,
  DataListProAllProps
} from './dataListProAll';
export type {
  DataListProAllMsgConfig as DLAMsg,
  DataListProAllSearchConfig as DLASearch,
  DataListProAllOptConfig as DLAOpt,
  DataListProAllOptParams as DLAOptParams,
  DataListProAllGetDataParams as DLAGetParams,
  DataListProAllGetDataRes as DLAGetRes
} from './dataListProAll';

export { DataSimpleListPro } from './dataSimpleListPro';
export type {
  DataSimpleListProSearchConfig,
  DataSimpleListProOptPosition,
  DataSimpleListProOptConfig,
  DataSimpleListProOptParams,
  DataSimpleListProGetDataParams,
  DataSimpleListProGetDataRes,
  DataSimpleListProProps
} from './dataSimpleListPro';
export type {
  DataSimpleListProSearchConfig as DSLSearch,
  DataSimpleListProOptConfig as DSLOpt,
  DataSimpleListProOptParams as DSLOptParams,
  DataSimpleListProGetDataRes as DSLGetParams,
  DataSimpleListProProps as DSLGetRes
} from './dataSimpleListPro';

export * as Time from './time';
export { showTime } from './time';
export type {
  TimeConfig,
  TimeShowConfig,
  TimeData,
  TimeStrategy,
  TimePointProps,
  TimeRangeProps,
  TimeShowProps,
  TimeShowRangeProps
} from './time';

export * as Upload from './upload';
export type {
  UploadFile,
  UploadData,
  UploadConfig,
  UploadListConfig,
  UploadImageConfig,
  UploadImageListConfig,
  UploadFormatKey,
  UploadValueConfig,
  UploadListValueConfig,
  UploadProps,
  UploadListProps,
  UploadImageProps,
  UploadImageListProps,
  UploadVideoConfig,
  UploadVideoValueConfig,
  UploadVideoProps
} from './upload';

export * as Pic from './pic';
export type {
  PicConfig,
  PicAvatarConfig,
  PicListProps,
  PicProps,
  PicAvatarProps
} from './pic';

export * as Video from './video';
export type {
  VideoConfig,
  VideoValue,
  VideoProps,
  VideoListProps
} from './video';

export * as Audio from './audio';
export type { AudioConfig, AudioProps, AudioListProps } from './audio';

export { Download } from './download';
export type { DownloadProps } from './download';

export { status } from './status';
export type {
  StatusConfig,
  SelectStatusProps,
  SwitchStatusProps,
  ShowStatusProps,
  ShowStatusListProps
} from './status';

export * as Editor from './editor';
export type {
  EditorConfig,
  EditorShowConfig,
  EditorTransDataConfig,
  EditorProps,
  EditorShowProps,
  EditorMediaInfo
} from './editor';

export { TypeInput } from './typeInput';
export type {
  TypeListConfig,
  TypeInputValue,
  TypeInputProps
} from './typeInput';

export * as SelectData from './selectData';
export type {
  SelectDataConfig,
  SelectDataItemProps,
  SelectDataLinkProps
} from './selectData';

export * as Layout from './layout';
export type {
  LayoutCollapsedConfig,
  LayoutAdminHeaderMenu,
  LayoutSidebarMenu,
  LayoutAdminHeaderConfig,
  LayoutSidebarConfig,
  LayoutAdminHeaderProps,
  LayoutSidebarProps,
  LayoutFooterProps
} from './layout';

export { AdminLayout } from './adminLayout';
export type { AdminLayoutProps } from './adminLayout';

export * as Map from './map';
export type {
  MapValue,
  MapConfig,
  MapPointConfig,
  MapItemProps,
  MapListProps,
  MapLineProps,
  MapCircleValue,
  MapCircleProps
} from './map';

export { Input } from './input';
