import { memo } from 'react';
import { useTranslation } from '@/context/I18nContext';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-status-ongoing-bg', text: 'text-status-ongoing' },
  on_track: { bg: 'bg-status-ongoing-bg', text: 'text-status-ongoing' },
  in_progress: { bg: 'bg-status-ongoing-bg', text: 'text-status-ongoing' },
  completed: { bg: 'bg-status-completed-bg', text: 'text-status-completed' },
  approved: { bg: 'bg-status-completed-bg', text: 'text-status-completed' },
  at_risk: { bg: 'bg-status-at-risk-bg', text: 'text-status-at-risk' },
  delayed: { bg: 'bg-status-delayed-bg', text: 'text-status-delayed' },
  todo: { bg: 'bg-gray-100', text: 'text-gray-600' },
  paused: { bg: 'bg-status-review-bg', text: 'text-status-review' },
  in_review: { bg: 'bg-status-at-risk-bg', text: 'text-status-at-risk' },
};

const FALLBACK = { bg: 'bg-gray-100', text: 'text-gray-600' };

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default memo(function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const { t } = useTranslation();
  const style = STATUS_STYLES[status] || FALLBACK;
  const label = t(`status.${status}`);

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text} ${className}`}>
      {label}
    </span>
  );
});
