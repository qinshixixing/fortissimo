import React, { useCallback, useMemo, useState } from 'react';
import { Upload, Button, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { downloadBlob } from '@fortissimo/util';

import type {
  UploadListConfig,
  UploadListValueConfig,
  UploadFile
} from '../index';

export type UploadListProps = UploadListConfig & UploadListValueConfig;

export function FileList(props: UploadListProps) {
  const accept = useMemo(() => {
    if (!props.format) return '';
    return props.format.map((item) => `.${item}`).join(',');
  }, [props.format]);

  const value = useMemo<UploadFile[]>(
    () =>
      (props.value || []).map((item, index) => {
        if (typeof item === 'string')
          return { uid: item, name: item, url: item, status: 'done' };
        return {
          ...item,
          uid: item.uid || item.url || String(-index),
          name: item.name,
          url: item.url,
          status:
            !props.progress && item.status === 'uploading'
              ? 'done'
              : item.status
        };
      }),
    [props.value, props.progress]
  );

  const onFileChange = useCallback(
    (data: UploadFile[]) => {
      if (!props.onChange) return;
      const result: UploadFile[] = [];
      (data || []).forEach((item) => {
        if (typeof item === 'string') result.push(item);
        else if (props.format) {
          const check = props.format.some((format) =>
            item.name.endsWith(format)
          );
          if (check) result.push(item);
        } else result.push(item);
      });
      props.onChange(result);
    },
    [props]
  );

  const [imagePreviewIndex, setImagePreviewIndex] = useState<number>();

  const previewFile = useCallback(
    async (file) => {
      if (!props.listType || props.listType === 'text') {
        let src = file.url;
        if (!src) {
          src = URL.createObjectURL(file.originFileObj);
        }
        downloadBlob({ url: src, filename: file.name });
      } else {
        const index = value.findIndex((item) => item.uid === file.uid);
        setImagePreviewIndex(index);
      }
    },
    [value, props.listType]
  );

  return (
    <>
      <Upload
        accept={accept}
        multiple={props.multiple}
        fileList={value}
        maxCount={props.maxNum}
        directory={props.directory}
        listType={props.listType}
        beforeUpload={() => {
          return false;
        }}
        onPreview={previewFile}
        onChange={(data) => {
          onFileChange(data.fileList);
        }}
      >
        {(props.selectAlways ||
          typeof props.maxNum !== 'number' ||
          props.maxNum > value.length) &&
          (props.listType === 'picture-card' ? (
            <div>
              <PlusOutlined />
              <div>{props.text || '上传'}</div>
            </div>
          ) : (
            <Button icon={<UploadOutlined />}>{props.text || '上传'}</Button>
          ))}
      </Upload>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: typeof imagePreviewIndex === 'number',
            onVisibleChange: (visible) =>
              setImagePreviewIndex(visible ? 0 : undefined),
            current: imagePreviewIndex
          }}
        >
          {value.map((item) => {
            let src = '';
            if (item.url) src = item.url;
            else if (item.originFileObj)
              src = URL.createObjectURL(item.originFileObj);
            return <Image key={item.uid} src={src} />;
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
}
