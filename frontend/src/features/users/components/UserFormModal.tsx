'use client';

import { memo, useEffect, useMemo } from 'react';
import { api, type TeamUser } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useFormState, useValidation } from '@/hooks';
import { userRules } from '../validation';
import { getRoleOptions } from '@/lib/constants';
import { Button, Input, Select, Modal } from '@/components/ui';

interface UserFormData {
  email: string;
  name: string;
  role: string;
  password: string;
}

const EMPTY_FORM: UserFormData = {
  email: '', name: '', role: 'member', password: '',
};

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: TeamUser;
  mode: 'create' | 'edit';
}

export default memo(function UserFormModal({
  isOpen, onClose, onSaved, initialData, mode,
}: UserFormModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();
  const { form, setForm, loading, setLoading, update } = useFormState<UserFormData>(EMPTY_FORM);

  const roleFormOptions = useMemo(() => {
    const allOptions = getRoleOptions(t);
    // Filter out the "all" option for form usage, and convert key -> value
    return allOptions.filter(o => o.key !== 'all').map(o => ({ value: o.key, label: o.label }));
  }, [t]);

  const rules = useMemo(() => userRules(t, mode), [t, mode]);

  const { errors, setErrors, validate, clearErrors } = useValidation<UserFormData>(rules);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) {
      setForm({
        email: initialData.email,
        name: initialData.name,
        role: initialData.role,
        password: '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    clearErrors();
  }, [isOpen, mode, initialData, setForm, clearErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    try {
      if (mode === 'edit' && initialData) {
        await api.updateUser(initialData.email, {
          name: form.name.trim(),
          role: form.role,
        });
        showSuccess(t('success.userUpdated'));
      } else {
        await api.createUser({
          email: form.email.trim(),
          name: form.name.trim(),
          role: form.role,
          password: form.password,
        });
        showSuccess(t('success.userCreated'));
      }
      onSaved();
      onClose();
    } catch (err) {
      handleApiError(err, showError, `${mode === 'edit' ? 'updating' : 'creating'} user`, t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? t('modal.editUser') : t('modal.createUser')} maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="user-name"
          label={t('form.name')}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />

        {mode === 'create' && (
          <Input
            id="user-email"
            label={t('form.email')}
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />
        )}

        <Select
          id="user-role"
          label={t('form.role')}
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          options={roleFormOptions}
        />

        {mode === 'create' && (
          <Input
            id="user-password"
            label={t('form.password')}
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
          />
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
          <Button type="submit" isLoading={loading}>
            {loading ? (mode === 'edit' ? t('form.saving') : t('form.creating')) : (mode === 'edit' ? t('form.saveChanges') : t('form.createUser'))}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
