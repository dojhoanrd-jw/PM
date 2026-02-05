'use client';

import { useMemo } from 'react';
import { api } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useFormState, useValidation } from '@/hooks';
import { passwordRules } from './validation';
import { Card, Button, Input } from '@/components/ui';
import { getCurrentUser } from '@/lib/auth';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_FORM: PasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();
  const currentUser = getCurrentUser();
  const { form, setForm, loading, setLoading, update } = useFormState<PasswordForm>(EMPTY_FORM);
  const rules = useMemo(() => passwordRules(t), [t]);
  const { errors, validate } = useValidation<PasswordForm>(rules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    try {
      await api.changePassword(form.currentPassword, form.newPassword);
      showSuccess(t('success.passwordChanged'));
      setForm(EMPTY_FORM);
    } catch (err) {
      handleApiError(err, showError, 'changing password', t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">{t('settings.title')}</h2>
        <p className="mt-1 text-sm text-text-secondary">{t('settings.subtitle')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Info */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('settings.profileInfo')}</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{t('settings.name')}</p>
              <p className="mt-1 text-sm text-text-primary">{currentUser?.name || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{t('settings.email')}</p>
              <p className="mt-1 text-sm text-text-primary">{currentUser?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{t('settings.role')}</p>
              <p className="mt-1 text-sm text-text-primary capitalize">
                {currentUser?.role?.replace('_', ' ') || '—'}
              </p>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('settings.changePassword')}</h3>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              id="current-password"
              label={t('settings.currentPassword')}
              type="password"
              value={form.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
              error={errors.currentPassword}
            />
            <Input
              id="new-password"
              label={t('settings.newPassword')}
              type="password"
              value={form.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              error={errors.newPassword}
            />
            <Input
              id="confirm-password"
              label={t('settings.confirmPassword')}
              type="password"
              value={form.confirmPassword}
              onChange={(e) => update('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
            />
            <div className="flex justify-end">
              <Button type="submit" isLoading={loading}>
                {loading ? t('settings.changing') : t('settings.changePassword')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
