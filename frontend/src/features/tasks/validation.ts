import type { Project } from '@/lib/api';
import type { TFn } from '@/context/I18nContext';

export const taskRules = (t: TFn, opts: { projects?: Project[]; mode: 'create' | 'edit' }) => ({
  title: (v: string) => (!v.trim() ? t('validation.titleRequired') : undefined),
  projectId: (v: string) => (opts.projects && !v ? t('validation.projectRequired') : undefined),
  assigneeId: (v: string) => (!v ? t('validation.assigneeRequired') : undefined),
  estimatedHours: (v: string) => (!v || Number(v) < 0.5 ? t('validation.minHours') : undefined),
  dueDate: (v: string) => {
    if (!v) return t('validation.dueDateRequired');
    if (opts.mode === 'create') {
      const today = new Date().toISOString().split('T')[0];
      if (v < today) return t('validation.dueDatePast');
    }
    return undefined;
  },
});
