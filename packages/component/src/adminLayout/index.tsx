import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { Layout } from '../index';
import type {
  LayoutCollapsedConfig,
  LayoutFooterProps,
  LayoutSidebarConfig,
  LayoutAdminHeaderConfig
} from '../index';

export interface AdminLayoutProps<K extends string = string>
  extends Omit<LayoutCollapsedConfig, 'collapsed'>,
    Omit<LayoutFooterProps, 'copyrightEnd'>,
    LayoutSidebarConfig,
    Omit<LayoutAdminHeaderConfig<K>, 'onCollapsed' | 'menuList' | 'onOpt'> {
  headerMenuList?: LayoutAdminHeaderConfig['menuList'];
  onHeaderMenuOpt?: (optKey: K) => void;
}

export function AdminLayout(props: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntLayout className={'ft-admin-layout'}>
      <Layout.AdminHeader
        title={props.title}
        logo={props.logo}
        avatar={props.avatar}
        userName={props.userName}
        canCollapsed={props.canCollapsed}
        collapsedWidth={props.collapsedWidth}
        expandWidth={props.expandWidth}
        menuList={props.headerMenuList}
        onOpt={props.onHeaderMenuOpt}
        collapsed={collapsed}
        onCollapsed={() => {
          setCollapsed(!collapsed);
        }}
      />
      <AntLayout>
        <Layout.Sidebar
          collapsed={collapsed}
          menuList={props.menuList}
          collapsedWidth={props.collapsedWidth}
          expandWidth={props.expandWidth}
        />
        <AntLayout.Content className={'ft-admin-layout-main'}>
          <div className={'ft-admin-layout-content'}>
            <Outlet />
          </div>
          <Layout.Footer
            copyrightStart={props.copyrightStart}
            corpName={props.corpName}
          />
        </AntLayout.Content>
      </AntLayout>
    </AntLayout>
  );
}
