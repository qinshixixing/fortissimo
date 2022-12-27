import React, { useCallback, useMemo, useRef } from 'react';
import { Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import type { UploadData } from '../../index';
import type { PicAvatarConfig } from '../index';

export interface PicAvatarProps extends PicAvatarConfig {
  value?: UploadData;
}

export function Avatar(props: PicAvatarProps) {
  const objUrlMap = useRef<Map<File, string>>(new Map());
  const getObjUrl = useCallback((file: File) => {
    let objUrl = objUrlMap.current.get(file);
    if (!objUrl) {
      objUrl = URL.createObjectURL(file);
      objUrlMap.current.set(file, objUrl);
    }
    return objUrl;
  }, []);

  const icon = useMemo(() => props.icon || <UserOutlined />, [props.icon]);

  const value = useMemo(() => {
    if (!props.value) return '';
    if (typeof props.value === 'string') return props.value;
    return props.value.originFileObj
      ? getObjUrl(props.value.originFileObj)
      : '';
  }, [props.value]);

  return !value && props.empty !== null && props.empty !== undefined ? (
    <>{props.empty}</>
  ) : (
    <AntAvatar {...props} src={value} icon={icon} />
  );
}
