import React from 'react';

import { FileList } from '../index';
import type { UploadConfig, UploadValueConfig } from '../index';

export type UploadProps = UploadConfig & UploadValueConfig;

export function File(props: UploadProps) {
  return (
    <FileList
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
