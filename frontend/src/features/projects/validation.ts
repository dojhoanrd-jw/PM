import type { TFn } from '@/context/I18nContext';

export const projectRules = (t: TFn) => ({
  name: (v: string) => (!v.trim() ? t('validation.projectNameRequired') : undefined),
  managerId: (v: string) => (!v ? t('validation.projectManagerRequired') : undefined),
  dueDate: (v: string) => (!v ? t('validation.dueDateRequired') : undefined),
});
