import type { TFn } from '@/context/I18nContext';

export const userRules = (t: TFn, mode: 'create' | 'edit') => ({
  name: (v: string) => (!v.trim() ? t('validation.nameRequired') : undefined),
  email: (v: string) => (mode === 'create' && !v.trim() ? t('validation.emailRequired') : undefined),
  password: (v: string) =>
    mode === 'create' && (!v || v.length < 6) ? t('validation.minChars') : undefined,
});
