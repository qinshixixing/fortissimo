import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { getRandomString } from '@fortissimo/util';
import { Video as VideoC } from '../../index';

import { File as FileC } from '../index';
import type { UploadConfig, UploadFormatKey, UploadData } from '../index';
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
          const file = new File([blob], '.png', {
            type: 'image/png'
          });
          const uid = getRandomString(4);
          resolve({
            ...file,
            uid,
            size: blob.size,
            originFileObj: file as any
          });
        } else reject('');
      });
    } else reject('');
  });
}

function getVideoInfo(file: File): Promise<VideoValue> {
  const videoEl = document.createElement('video');
  const src = URL.createObjectURL(file);
  videoEl.src = src;
  videoEl.preload = 'auto';
  return new Promise((resolve) => {
    videoEl.oncanplay = async () => {
      videoEl.width = videoEl.videoWidth;
      videoEl.height = videoEl.videoHeight;
      const cover = await getVideoCover(videoEl);
      resolve({
        url: src,
        size: file.size,
        duration: videoEl.duration,
        width: videoEl.width,
        height: videoEl.height,
        cover
      });
    };
  });
}

export function Video(props: UploadVideoProps) {
  return (
    <FileC
      {...props}
      format={['mp4']}
      itemRender={(originNode, file, currFileList, { remove }) => {
        return (
          <div className={'ft-upload-video-show'}>
            <div
              className={'ft-upload-video-delete'}
              onClick={() => {
                remove();
              }}
            >
              <DeleteOutlined />
            </div>
            <VideoC.Item value={props.value} />
          </div>
        );
      }}
      value={props.value && props.value.url}
      onChange={(data) => {
        if (!props.onChange) return;
        if (!data) props.onChange({ url: '' });
        if (typeof data !== 'string') {
          const videoFile = data.originFileObj as File;
          getVideoInfo(videoFile).then((info) => {
            props.onChange &&
              props.onChange({
                ...info,
                url: data
              });
          });
        } else
          props.onChange({
            ...props.value,
            url: data
          });
      }}
    />
  );
}
