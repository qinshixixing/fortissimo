import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { getRandomString } from '@fortissimo/util';
import { Item } from '../../video';

import { FileList, UploadData } from '../index';
import type { UploadConfig, UploadFormatKey } from '../index';
import type { VideoValue } from '../../index';

export type UploadVideoConfig = Omit<UploadConfig, UploadFormatKey>;

export interface UploadVideoValueConfig {
  value?: VideoValue;
  onChange?: (data: VideoValue) => void;
}

export type UploadVideoProps = UploadVideoConfig & UploadVideoValueConfig;

function getVideoCover(video: HTMLVideoElement): Promise<UploadData> {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  return new Promise((resolve, reject) => {
    if (ctx) {
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], '');
          const uid = getRandomString(4);
          resolve({
            ...file,
            uid,
            size: blob.size,
            originFileObj: {
              uid,
              lastModifiedDate: new Date(file.lastModified),
              ...file
            }
          });
        } else reject('');
      });
    } else reject('');
  });
}

function getVideoInfo(file: File): Promise<VideoValue> {
  const videoEl = document.createElement('video');
  videoEl.preload = 'auto';
  return new Promise((resolve) => {
    videoEl.oncanplay = async () => {
      videoEl.width = videoEl.videoWidth;
      videoEl.height = videoEl.videoHeight;
      resolve({
        url: URL.createObjectURL(file),
        size: file.size,
        duration: videoEl.duration,
        width: videoEl.width,
        height: videoEl.height,
        cover: await getVideoCover(videoEl)
      });
    };
  });
}

export function Video(props: UploadVideoProps) {
  return (
    <FileList
      {...props}
      maxNum={1}
      multiple={false}
      format={['mp4']}
      itemRender={(originNode, file, currFileList, { remove }) => {
        return (
          <div className={'ft-upload-video-show'}>
            <DeleteOutlined
              className={'ft-upload-video-delete'}
              onClick={() => {
                remove();
              }}
            />
            <Item value={props.value} />
          </div>
        );
      }}
      value={props.value ? [props.value.url] : []}
      onChange={(data) => {
        if (!props.onChange) return;
        if (!data || !data.length) props.onChange({ url: '' });
        const video = data[0];
        const info = {
          ...props.value
        };
        if (typeof video !== 'string') {
          const videoFile = video.originFileObj as File;
          getVideoInfo(videoFile).then((data) => {
            props.onChange &&
              props.onChange({
                ...data,
                url: video
              });
          });
        } else
          props.onChange({
            ...info,
            url: video
          });
      }}
    />
  );
}
