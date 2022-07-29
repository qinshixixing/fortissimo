import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';

export interface SideBarMenu {
  path: string;
  title: string;
  icon?: React.ReactNode;
  children?: SideBarMenu[];
}

export interface SideBarProps {
  menuList: SideBarMenu[];
  expandWidth?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
  expandOneRootSubmenu?: boolean;
}

function checkPathInclude(path: string, targetPath: string) {
  const pathArr = path.split('/');
  if (!targetPath.startsWith('/')) targetPath = `/${targetPath}`;
  const targetPathArr = targetPath.split('/');
  return targetPathArr.every((item, index) => pathArr[index] === item);
}

function getKeysFromLocation(pathname: string, menuList: SideBarMenu[]) {
  let selectedKey = '';
  const openKeys: string[] = [];

  const find = (list: SideBarMenu[], parentKey?: string): boolean => {
    return list.some((item) => {
      if (item.children && item.children.length) {
        const result = find(item.children, item.path);
        if (result && parentKey) openKeys.push(parentKey);
        return result;
      } else if (checkPathInclude(pathname, item.path)) {
        if (parentKey) openKeys.push(parentKey);
        selectedKey = item.path;
        return true;
      } else return false;
    });
  };
  find(menuList);
  return {
    selectedKey,
    openKeys
  };
}

export function Sidebar(props: SideBarProps) {
  const location = useLocation();

  const rootSubmenuKeys = useMemo(() => {
    const data: string[] = [];
    props.menuList.forEach((item) => {
      if (item.children && item.children.length) data.push(item.path);
    });
    return data;
  }, [props.menuList]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onOpenChange = useCallback(
    (keys: string[]) => {
      if (!props.expandOneRootSubmenu) setOpenKeys(keys);
      else {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key));
        if (!latestOpenKey || !rootSubmenuKeys.includes(latestOpenKey))
          setOpenKeys(keys);
        else setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    },
    [openKeys, rootSubmenuKeys, props.expandOneRootSubmenu]
  );

  useEffect(() => {
    const keys = getKeysFromLocation(location.pathname, props.menuList);
    setSelectedKeys([keys.selectedKey]);
    if (props.expandOneRootSubmenu) setOpenKeys(keys.openKeys);
    else setOpenKeys(Array.from(new Set([...openKeys, ...keys.openKeys])));
  }, [location.pathname, props.menuList, props.expandOneRootSubmenu]);

  const renderMenu = useCallback((list: SideBarMenu[]) => {
    return list.map((item) => {
      if (item.children && item.children.length) {
        return (
          <Menu.SubMenu key={item.path} icon={item.icon} title={item.title}>
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path} icon={item.icon}>
          <Link to={item.path}>{item.title}</Link>
        </Menu.Item>
      );
    });
  }, []);

  return (
    <Layout.Sider
      className={'ft-sidebar'}
      collapsed={props.collapsed}
      width={props.expandWidth || 250}
      collapsedWidth={props.collapsedWidth || 80}
    >
      <Menu
        mode={'inline'}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        {renderMenu(props.menuList)}
      </Menu>
    </Layout.Sider>
  );
}
