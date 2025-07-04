import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: '대시보드', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: '사용자', href: paths.dashboard.customers, icon: 'users' },
  { key: 'generalboard', title: '일반 / 한정 게시판', href: paths.dashboard.generalboard, icon: 'note-pencil' },
  { key: 'noticesboard', title: '공지 / 문의 게시판', href: paths.dashboard.noticesboard, icon: 'bell-simple' },
  { key: 'fraudboard', title: '사기 / 신고 피해 게시판', href: paths.dashboard.fraudboard, icon: 'shield-warning' },
] satisfies NavItemConfig[];
