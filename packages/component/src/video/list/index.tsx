import React, { useCallback, useMemo, useRef } from 'react';
import Player from 'griffith';

import type { VideoConfig, VideoValue } from '../index';

export interface VideoListProps extends VideoConfig {
  value?: VideoValue[];
}

interface GriffithValue extends VideoValue {
  url: string;
}

export function List(props: VideoListProps) {
  const objUrlMap = useRef<Map<File, string>>(new Map());
  const getObjUrl = useCallback((file: File) => {
    let objUrl = objUrlMap.current.get(file);
    if (!objUrl) {
      objUrl = URL.createObjectURL(file);
      objUrlMap.current.set(file, objUrl);
    }
    return objUrl;
  }, []);

  // 是否有自定义空值
  const hasEmpty = useMemo(
    () => props.empty !== null && props.empty !== undefined,
    [props.empty]
  );

  const value = useMemo(() => {
    const data = props.value || [];
    const result: GriffithValue[] = [];
    data.forEach((item) => {
      const urlData = item && item.url;
      if (!hasEmpty || Boolean(urlData)) {
        let url = '';
        if (typeof urlData === 'string') url = urlData;
        else if (urlData.originFileObj) url = getObjUrl(urlData.originFileObj);
        result.push({
          ...(item || {}),
          url
        });
      }
    });

    if (hasEmpty) return result;
    if (!result.length) result.push({ url: '' });
    return result;
  }, [props.value, hasEmpty, getObjUrl]);

  return (
    <div>
      {value.length > 0
        ? value.map((item, index) => {
            const key = item.url || String(index);
            return (
              <div
                key={key}
                style={{
                  width: props.width,
                  height: props.height
                }}
              >
                <Player
                  id={key}
                  locale={'zh-Hans'}
                  cover={item.cover}
                  duration={Number(item.duration)}
                  sources={{
                    sd: {
                      play_url: item.url,
                      size: Number(item.size),
                      width: Number(item.width),
                      height: Number(item.height)
                    }
                  }}
                />
              </div>
            );
          })
        : props.empty}
    </div>
  );
}
