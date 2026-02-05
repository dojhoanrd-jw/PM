import type { TFn } from '@/context/I18nContext';

export const loginRules = (t: TFn) => ({
  email: (v: string) => (!v.trim() ? t('validation.emailRequired') : undefined),
  password: (v: string) => (!v ? t('validation.passwordRequired') : undefined),
});
