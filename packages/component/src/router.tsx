import React, { memo, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';

export interface Route {
  path: string;
  component: React.ReactNode;
  layout?: React.ReactNode;
  routes?: Route[];
  childRoutes?: boolean;
  root?: boolean;
}

export const Router = memo((props: { config: Route[] }) => {
  const routeByLayout = useMemo(() => {
    const getRoute = (routes: Route[], basePath: string) => {
      // 存储本层路由配置
      const layoutArr: ReactNode[] = [];
      const layoutRoute: Map<ReactNode, ReactNode[]> = new Map();
      // 存储最外层路由配置
      const rootLayoutRoute: Map<ReactNode, ReactNode[]> = new Map();
      const isRoot = basePath === '' || basePath === '/';
      // 遍历每条路由配置
      routes.forEach((item, index) => {
        // 获取该条路由模版内容
        let layoutComponent: ReactNode;
        if (item.layout) {
          layoutComponent = item.layout;
        } else {
          layoutComponent = '';
        }
        // 获取该路由同一模版下路由列表
        let routeConfig: ReactNode[];
        if (item.root) {
          if (rootLayoutRoute.has(layoutComponent)) {
            routeConfig = rootLayoutRoute.get(layoutComponent) as ReactNode[];
          } else {
            routeConfig = [];
            rootLayoutRoute.set(layoutComponent, routeConfig);
          }
        } else {
          if (layoutRoute.has(layoutComponent)) {
            routeConfig = layoutRoute.get(layoutComponent) as ReactNode[];
          } else {
            layoutArr.push(layoutComponent);
            routeConfig = [];
            layoutRoute.set(layoutComponent, routeConfig);
          }
        }
        // 设置路由配置
        let component: ReactNode;
        const childFlag = item.childRoutes
          ? `${item.path.endsWith('/') ? '' : '/'}*`
          : '';
        const currentPath = `${basePath}${basePath.endsWith('/') ? '' : '/'}${
          item.path
        }`;
        const routePath = item.root ? currentPath : item.path;
        if (item.path === '' || item.path === '/') {
          component = (
            <Route key={index} index element={item.component}></Route>
          );
        } else if (item.routes && item.routes.length) {
          // 处理子级冒泡上来的最外层路由
          const { route, rootroute } = getRoute(item.routes, currentPath);
          rootroute.forEach((value, key) => {
            if (rootLayoutRoute.has(key)) {
              rootLayoutRoute.set(layoutComponent, [
                ...(rootLayoutRoute.get(key) as ReactNode[]),
                ...value
              ]);
            } else {
              rootLayoutRoute.set(key, value);
            }
          });
          component = (
            <Route
              key={index}
              path={`${routePath}${childFlag}`}
              element={item.component}
            >
              {route}
            </Route>
          );
        } else {
          component = (
            <Route
              key={index}
              path={`${routePath}${childFlag}`}
              element={item.component}
            />
          );
        }
        routeConfig.push(component);
      });
      // 最外层合并路由
      if (isRoot) {
        rootLayoutRoute.forEach((value, key) => {
          if (layoutRoute.has(key)) {
            layoutRoute.set(key, [
              ...(layoutRoute.get(key) as ReactNode[]),
              ...value
            ]);
          } else {
            layoutArr.push(key);
            layoutRoute.set(key, value);
          }
        });
      }
      // 生成路由节点
      const route = layoutArr.map((layoutComponent, index) => {
        const routeComponents = layoutRoute.get(layoutComponent);
        if (layoutComponent === '')
          return (
            <Route key={index} path=''>
              {routeComponents}
            </Route>
          );
        else {
          return (
            <Route key={index} path='' element={layoutComponent}>
              {routeComponents}
            </Route>
          );
        }
      });

      return {
        route,
        rootroute: rootLayoutRoute
      };
    };

    const { route } = getRoute(props.config, '');

    return route;
  }, [props.config]);
  return <Routes>{routeByLayout}</Routes>;
});
