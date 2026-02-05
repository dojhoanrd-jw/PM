import { memo } from 'react';
import { PRIORITY_STYLES } from '@/lib/constants';
import { useTranslation } from '@/context/I18nContext';

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const style = PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style} ${className}`}>
      {t(`priority.${priority}`)}
    </span>
  );
}

export default memo(PriorityBadge);
