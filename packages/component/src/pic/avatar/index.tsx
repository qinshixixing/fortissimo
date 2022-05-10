import React, { useMemo } from 'react';
import { Avatar as AntAvatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import type { PicAvatarConfig } from '../index';

export interface PicAvatarProps extends PicAvatarConfig {
  value?: string;
}

export function Avatar(props: PicAvatarProps) {
  const icon = useMemo(() => props.icon || <UserOutlined />, [props.icon]);

  return !props.value && props.empty !== null && props.empty !== undefined ? (
    <>{props.empty}</>
  ) : (
    <AntAvatar {...props} src={props.value} icon={icon} />
  );
}
