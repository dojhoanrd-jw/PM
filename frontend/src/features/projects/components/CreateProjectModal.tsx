'use client';

import { memo, useEffect, useMemo, useState } from 'react';
import { api, type TeamUser } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useFormState, useValidation } from '@/hooks';
import { projectRules } from '../validation';
import { getProjectStatusOptions } from '@/lib/constants';
import { Button, Input, Textarea, Select, Modal } from '@/components/ui';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface ProjectFormData {
  name: string;
  description: string;
  status: string;
  managerId: string;
  dueDate: string;
}

const INITIAL_FORM: ProjectFormData = {
  name: '',
  description: '',
  status: 'active',
  managerId: '',
  dueDate: '',
};

export default memo(function CreateProjectModal({ isOpen, onClose, onCreated }: CreateProjectModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();
  const { form, loading, setLoading, update, reset } = useFormState(INITIAL_FORM);
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const rules = useMemo(() => projectRules(t), [t]);
  const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);
  const { errors, validate, clearErrors } = useValidation<ProjectFormData>(rules);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const data = await api.getUsers();
        if (!cancelled) setUsers(data.users);
      } catch {
        if (!cancelled) showError(t('error.loadTeamMembers'));
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    fetchUsers();
    return () => { cancelled = true; };
  }, [isOpen, showError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    const selectedManager = users.find((u) => u.email === form.managerId);

    setLoading(true);
    try {
      await api.createProject({
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        managerId: form.managerId,
        managerName: selectedManager?.name || '',
        dueDate: form.dueDate,
      });
      showSuccess(t('success.projectCreated'));
      reset();
      onCreated();
      onClose();
    } catch (err) {
      handleApiError(err, showError, 'creating project', t);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      clearErrors();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('modal.newProject')} maxWidth="md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="project-name"
          label={t('form.projectName')}
          placeholder={t('form.projectNamePlaceholder')}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />

        <Textarea
          id="project-desc"
          label={t('form.description')}
          placeholder={t('form.descriptionPlaceholder')}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          maxLength={500}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="project-status"
            label={t('form.status')}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            options={statusOptions}
          />

          <Input
            id="project-due"
            label={t('form.dueDate')}
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <Select
          id="project-manager"
          label={t('form.projectManager')}
          value={form.managerId}
          onChange={(e) => update('managerId', e.target.value)}
          disabled={loadingUsers}
          error={errors.managerId}
          placeholder={loadingUsers ? t('common.loading') : t('form.selectManager')}
        >
          {users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.name} ({user.role})
            </option>
          ))}
        </Select>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={loading}>
            {loading ? t('form.creating') : t('form.createProject')}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
