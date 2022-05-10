import type { ReactNode } from 'react';
import type { ImageProps, AvatarProps } from 'antd';

export interface PicConfig extends Omit<ImageProps, 'src'> {
  empty?: ReactNode;
}

export interface PicAvatarConfig extends Omit<AvatarProps, 'src'> {
  empty?: ReactNode;
}

export { List } from './list';
export type { PicListProps } from './list';

export { Item } from './item';
export type { PicProps } from './item';

export { Avatar } from './avatar';
export type { PicAvatarProps } from './avatar';
