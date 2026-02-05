import type { TFn } from '@/context/I18nContext';

// ── Styles ───────────────────────────────────────────────────────────
export const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'bg-status-at-risk-bg text-status-at-risk',
  high: 'bg-status-delayed-bg text-status-delayed',
  medium: 'bg-status-ongoing-bg text-status-ongoing',
  low: 'bg-gray-100 text-gray-600',
};

export function getRoleLabels(t: TFn): Record<string, string> {
  return {
    admin: t('role.admin'),
    project_manager: t('role.project_manager'),
    member: t('role.member'),
  };
}

export const ROLE_STYLES: Record<string, string> = {
  admin: 'bg-status-at-risk-bg text-status-at-risk',
  project_manager: 'bg-status-ongoing-bg text-status-ongoing',
  member: 'bg-gray-100 text-gray-600',
};

// ── Filter option arrays (with "all" option) ─────────────────────────
export function getStatusOptions(t: TFn) {
  return [
    { key: 'all', label: t('status.all') },
    { key: 'todo', label: t('status.todo') },
    { key: 'in_progress', label: t('status.in_progress') },
    { key: 'in_review', label: t('status.in_review') },
    { key: 'completed', label: t('status.completed') },
    { key: 'approved', label: t('status.approved') },
  ];
}

export function getPriorityOptions(t: TFn) {
  return [
    { key: 'all', label: t('priority.all') },
    { key: 'urgent', label: t('priority.urgent') },
    { key: 'high', label: t('priority.high') },
    { key: 'medium', label: t('priority.medium') },
    { key: 'low', label: t('priority.low') },
  ];
}

export function getRoleOptions(t: TFn) {
  return [
    { key: 'all', label: t('role.all') },
    { key: 'admin', label: t('role.admin') },
    { key: 'project_manager', label: t('role.project_manager') },
    { key: 'member', label: t('role.member') },
  ];
}

// ── Form option arrays (for Select components in modals) ─────────────
export function getTaskStatusOptions(t: TFn) {
  return [
    { value: 'todo', label: t('status.todo') },
    { value: 'in_progress', label: t('status.in_progress') },
    { value: 'in_review', label: t('status.in_review') },
    { value: 'completed', label: t('status.completed') },
  ];
}

export function getTaskPriorityOptions(t: TFn) {
  return [
    { value: 'low', label: t('priority.low') },
    { value: 'medium', label: t('priority.medium') },
    { value: 'high', label: t('priority.high') },
    { value: 'urgent', label: t('priority.urgent') },
  ];
}

export function getTaskCategoryOptions(t: TFn) {
  return [
    { value: 'important', label: t('taskCategory.important') },
    { value: 'notes', label: t('taskCategory.notes') },
    { value: 'link', label: t('taskCategory.link') },
  ];
}

export function getProjectStatusOptions(t: TFn) {
  return [
    { value: 'active', label: t('projectStatus.active') },
    { value: 'paused', label: t('projectStatus.paused') },
  ];
}

export function getProjectProgressOptions(t: TFn) {
  return [
    { value: 'on_track', label: t('projectProgress.on_track') },
    { value: 'at_risk', label: t('projectProgress.at_risk') },
    { value: 'delayed', label: t('projectProgress.delayed') },
    { value: 'completed', label: t('projectProgress.completed') },
  ];
}

export function getDashboardPeriodOptions(t: TFn) {
  return [
    { value: '7days', label: t('period.7days') },
    { value: '1month', label: t('period.1month') },
    { value: '3months', label: t('period.3months') },
    { value: '6months', label: t('period.6months') },
    { value: '1year', label: t('period.1year') },
  ];
}

// ── Page titles ──────────────────────────────────────────────────────
export function getPageTitles(t: TFn): Record<string, string> {
  return {
    '/dashboard': t('nav.dashboard'),
    '/projects': t('nav.projects'),
    '/tasks': t('nav.tasks'),
    '/users': t('nav.users'),
    '/settings': t('nav.settings'),
  };
}

// ── Shared CSS classes ───────────────────────────────────────────────
export const FILTER_SELECT_CLASSES =
  'rounded-lg border border-border bg-white px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent cursor-pointer';

export const PILL_SELECT_CLASSES =
  'appearance-none rounded-full bg-white pl-4 pr-8 py-1.5 text-sm font-medium text-text-primary shadow-sm outline-none cursor-pointer';

// ── Helpers ──────────────────────────────────────────────────────────
const LOCALE_MAP: Record<string, string> = { en: 'en-US', es: 'es-ES' };

export function formatDate(iso: string, locale: string = 'en'): string {
  return new Date(iso).toLocaleDateString(LOCALE_MAP[locale] || 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
