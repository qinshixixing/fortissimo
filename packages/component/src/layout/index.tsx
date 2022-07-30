export interface LayoutCollapsedConfig {
  expandWidth?: number;
  collapsedWidth?: number;
  collapsed?: boolean;
}

export { AdminHeader } from './adminHeader';
export type {
  LayoutAdminHeaderMenu,
  LayoutAdminHeaderProps
} from './adminHeader';

export { Sidebar } from './sidebar';
export type { LayoutSideBarMenu, LayoutSideBarProps } from './sidebar';

export { Footer } from './footer';
export type { LayoutFooterProps } from './footer';
