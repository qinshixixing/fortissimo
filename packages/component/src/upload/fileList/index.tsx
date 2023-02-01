import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Upload, Button, Image } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { downloadBlob } from '@fortissimo/util';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import { DraggableUploadListItem } from './draggableUploadListItem';

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
      (props.value || []).map((item: UploadData, index) => {
        if (typeof item === 'string')
          return { uid: item, name: item, url: item, status: 'done' };
        const url = item.originFileObj
          ? getObjUrl(item.originFileObj)
          : item.url;
        return {
          ...item,
          uid: item.uid || String(-index),
          name: item.name,
          url,
          status:
            !props.progress && item.status === 'uploading'
              ? 'done'
              : item.status
        };
      }),
    [props.value, props.progress, getObjUrl]
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

  const onMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newValue = [...value];
      const dragRow = newValue[dragIndex];
      props.onChange &&
        props.onChange(
          update(newValue, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragRow]
            ]
          })
        );
    },
    [props, value]
  );

  const uploadContent = (
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
      itemRender={
        props.draggable
          ? (originNode, file, currFileList, actions) => {
              const node = props.itemRender ? (
                <>{props.itemRender(originNode, file, currFileList, actions)}</>
              ) : (
                originNode
              );
              return (
                <DraggableUploadListItem
                  originNode={node}
                  file={file}
                  fileList={currFileList}
                  moveRow={onMove}
                />
              );
            }
          : props.itemRender
      }
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
  );

  return (
    <>
      {props.draggable ? (
        <DndProvider backend={HTML5Backend}>{uploadContent}</DndProvider>
      ) : (
        uploadContent
      )}
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
