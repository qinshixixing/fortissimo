import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Upload, Button, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { downloadBlob } from '@fortissimo/util';

import type {
  UploadListConfig,
  UploadListValueConfig,
  UploadFile,
  UploadData
} from '../index';

export type UploadListProps = UploadListConfig & UploadListValueConfig;

export function FileList(props: UploadListProps) {
  const objUrlMap = useRef<Map<File, string>>(new Map());
  const getObjUrl = useCallback((file: File) => {
    let objUrl = objUrlMap.current.get(file);
    if (!objUrl) {
      objUrl = URL.createObjectURL(file);
      objUrlMap.current.set(file, objUrl);
    }
    return objUrl;
  }, []);

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
    (data: UploadData[]) => {
      if (!props.onChange) return;
      const result: UploadData[] = [];
      (data || []).forEach((item: UploadData) => {
        if (typeof item === 'string') result.push(item);
        else if (props.format) {
          const check = props.format.some((format) =>
            item.name.toLowerCase().endsWith(format.toLowerCase())
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
        if (!src) src = getObjUrl(file.originFileObj);
        downloadBlob({ url: src, filename: file.name });
      } else {
        const index = value.findIndex((item) => item.uid === file.uid);
        setImagePreviewIndex(index);
      }
    },
    [props.listType, getObjUrl, value]
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
            else if (item.originFileObj) src = getObjUrl(item.originFileObj);
            return <Image key={item.uid} src={src} />;
          })}
        </Image.PreviewGroup>
      </div>
    </>
  );
}
