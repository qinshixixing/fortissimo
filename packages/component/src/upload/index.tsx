import type { UploadFile } from 'antd/lib/upload/interface';
import type { UploadProps } from 'antd';

export { UploadFile };
export type UploadData = UploadFile | string;

export interface UploadConfig {
  text?: string;
  progress?: boolean;
  selectAlways?: boolean;
  directory?: boolean;
  format?: string[];
  listType?: 'text' | 'picture' | 'picture-card';
  itemRender?: UploadProps['itemRender'];
}

export interface UploadListConfig extends UploadConfig {
  multiple?: boolean;
  maxNum?: number;
}

export type UploadFormatKey = 'listType';

export interface UploadValueConfig {
  value?: UploadData;
  onChange?: (data: UploadData) => void;
}

export interface UploadListValueConfig {
  value?: UploadData[];
  onChange?: (data: UploadData[]) => void;
  draggable?: boolean;
}

export { FileList } from './fileList';
export type { UploadListProps } from './fileList';

export { File } from './file';
export type { UploadProps } from './file';

export { ImageList } from './imageList';
export type { UploadImageListConfig, UploadImageListProps } from './imageList';

export { Image } from './image';
export type { UploadImageConfig, UploadImageProps } from './image';

export { Video } from './video';
export type {
  UploadVideoConfig,
  UploadVideoValueConfig,
  UploadVideoProps
} from './video';
