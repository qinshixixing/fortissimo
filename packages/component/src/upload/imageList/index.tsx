import React from 'react';

import { FileList } from '../index';
import type {
  UploadListConfig,
  UploadListValueConfig,
  UploadFormatKey
} from '../index';

export type UploadImageListConfig = Omit<UploadListConfig, UploadFormatKey>;

export type UploadImageListProps = UploadImageListConfig &
  UploadListValueConfig;

export function ImageList(props: UploadImageListProps) {
  return (
    <FileList
      {...props}
      format={props.format || ['jpg', 'jpeg', 'png']}
      listType={'picture-card'}
    />
  );
}
