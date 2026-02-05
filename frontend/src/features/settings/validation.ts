import type { TFn } from '@/context/I18nContext';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const passwordRules = (t: TFn) => ({
  currentPassword: (v: string) => (!v ? t('validation.currentPasswordRequired') : undefined),
  newPassword: (v: string, form: PasswordForm) => {
    if (!v || v.length < 6) return t('validation.newPasswordMin');
    if (form.currentPassword && v === form.currentPassword)
      return t('validation.newPasswordDifferent');
    return undefined;
  },
  confirmPassword: (v: string, form: PasswordForm) =>
    v !== form.newPassword ? t('validation.passwordsNoMatch') : undefined,
});
