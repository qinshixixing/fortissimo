export interface LayoutCollapsedConfig {
  expandWidth?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
}

export { AdminHeader } from './adminHeader';
export type {
  LayoutAdminHeaderMenu,
  LayoutAdminHeaderConfig,
  LayoutAdminHeaderProps
} from './adminHeader';

export { Sidebar } from './sidebar';
export type {
  LayoutSidebarMenu,
  LayoutSidebarConfig,
  LayoutSidebarProps
} from './sidebar';

export { Footer } from './footer';
export type { LayoutFooterProps } from './footer';
