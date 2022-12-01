import React, { useMemo } from 'react';
import { getBrowserType } from '@fortissimo/util';
import H5AudioPlayer from '@fortissimo-deps/react-h5-audio-player';

import type { AudioConfig } from '../index';
import type { UploadData } from '../../index';

const isSafari = getBrowserType() === 'Safari';

export interface AudioListProps extends AudioConfig {
  value?: UploadData[];
}

interface PlayerValue {
  url: string;
  needSource: boolean;
}

function checkNeedSource(url: string): boolean {
  if (!isSafari || !url) return false;
  const index1 = url.lastIndexOf('/');
  const index2 = url.lastIndexOf('.');
  return index1 > index2;
}

export function List(props: AudioListProps) {
  // 是否有自定义空值
  const hasEmpty = useMemo(
    () => props.empty !== null && props.empty !== undefined,
    [props.empty]
  );

  const value = useMemo(() => {
    const data = props.value || [];
    const result: PlayerValue[] = [];
    data.forEach((item) => {
      if (!hasEmpty || Boolean(item)) {
        const url =
          typeof item === 'string'
            ? item
            : item.originFileObj
            ? URL.createObjectURL(item.originFileObj)
            : '';
        result.push({
          url,
          needSource: typeof item === 'string' ? checkNeedSource(url) : false
        });
      }
    });

    if (hasEmpty) return result;
    if (!result.length) result.push({ url: '', needSource: false });
    return result;
  }, [props.value, hasEmpty]);

  return (
    <div>
      {value.length > 0
        ? value.map((item, index) => {
            const key = item.url || String(index);
            return (
              <H5AudioPlayer
                key={key}
                src={item.needSource ? undefined : item.url}
              >
                {item.needSource ? (
                  <source src={item.url} type={'audio/mpeg'} />
                ) : (
                  ''
                )}
              </H5AudioPlayer>
            );
          })
        : props.empty}
    </div>
  );
}
