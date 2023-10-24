import React from 'react';
import { Avatar, Button, Dropdown, Menu, Layout, Image, Badge } from 'antd';
import { MenuOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';

import type { LayoutCollapsedConfig } from '../index';

export interface LayoutAdminHeaderMenu<K extends string = string> {
  key: K;
  name: string;
}

export interface LayoutAdminHeaderConfig<K extends string = string> {
  menuList?: LayoutAdminHeaderMenu<K>[];
  onOpt?: (optKey: K) => void;
  logo?: string;
  title: string;
  avatar?: string;
  userName: string;
  canCollapsed?: boolean;
  onCollapsed?: () => void;
  centerContent?: React.ReactNode;
  showMessage?: boolean;
  messageNum?: number;
  onMessageDetail?: () => void;
}

export interface LayoutAdminHeaderProps<K extends string = string>
  extends LayoutCollapsedConfig,
    LayoutAdminHeaderConfig<K> {}

export function AdminHeader(props: LayoutAdminHeaderProps) {
  const menu = (
    <Menu>
      {(props.menuList || []).map((item) => (
        <Menu.Item
          key={item.key}
          onClick={() => {
            props.onOpt && props.onOpt(item.key);
          }}
        >
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const userInfo = (
    <Button className={'ft-layout-admin-header-user'} type='primary'>
      <Avatar>
        {props.avatar ? <Image src={props.avatar} /> : <UserOutlined />}
      </Avatar>
      <span className={'ft-layout-admin-header-user-name'}>
        {props.userName || ''}
      </span>
    </Button>
  );

  return (
    <Layout.Header className={'ft-layout-admin-header'}>
      <div className={'ft-layout-admin-header-side-box'}>
        <div
          className={
            'ft-layout-admin-header-title' +
            (props.collapsed
              ? ` ${'ft-layout-admin-header-title-collapsed'}`
              : '')
          }
          style={{
            width: props.collapsed ? props.collapsedWidth : props.expandWidth
          }}
        >
          {props.logo && (
            <img
              className={'ft-layout-admin-header-logo'}
              src={props.logo}
              alt={''}
            />
          )}
          {!props.collapsed && (
            <span className={'ft-layout-admin-header-title-text'}>
              {props.title}
            </span>
          )}
        </div>
        {props.canCollapsed && (
          <Button
            type='primary'
            className={'ft-layout-admin-header-collapsed-control'}
            icon={<MenuOutlined />}
            onClick={() => {
              props.onCollapsed && props.onCollapsed();
            }}
          />
        )}
      </div>
      {!!props.centerContent && props.centerContent}
      <div className={'ft-layout-admin-header-side-box'}>
        {props.showMessage && (
          <Badge count={props.messageNum || 0} size={'small'}>
            <BellOutlined
              className={'ft-layout-admin-header-message'}
              onClick={() => {
                props.onMessageDetail && props.onMessageDetail();
              }}
            />
          </Badge>
        )}
        {props.menuList && props.menuList.length > 0 ? (
          <Dropdown
            overlay={menu}
            placement='bottom'
            arrow={{ pointAtCenter: true }}
          >
            {userInfo}
          </Dropdown>
        ) : (
          userInfo
        )}
      </div>
    </Layout.Header>
  );
}
