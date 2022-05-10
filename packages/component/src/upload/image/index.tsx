import React from 'react';

import { ImageList } from '../index';
import type {
  UploadConfig,
  UploadValueConfig,
  UploadFormatKey
} from '../index';

export type UploadImageConfig = Omit<UploadConfig, UploadFormatKey>;

export type UploadImageProps = UploadImageConfig & UploadValueConfig;

export function Image(props: UploadImageProps) {
  return (
    <ImageList
      {...props}
      maxNum={1}
      multiple={false}
      value={props.value ? [props.value] : []}
      onChange={(data) => {
        if (!props.onChange) return;
        props.onChange(data[0]);
      }}
    />
  );
}
