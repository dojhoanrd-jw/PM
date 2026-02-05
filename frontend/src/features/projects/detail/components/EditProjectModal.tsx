'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, type Project, type TeamUser } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useFormState, useValidation } from '@/hooks';
import { projectRules } from '../../validation';
import { getProjectStatusOptions, getProjectProgressOptions } from '@/lib/constants';
import { Button, Input, Textarea, Select, Modal } from '@/components/ui';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const INITIAL_FORM = {
  name: '',
  description: '',
  status: '',
  progress: '',
  managerId: '',
  dueDate: '',
};

export default function EditProjectModal({ project, isOpen, onClose, onUpdated }: EditProjectModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();
  const { form, setForm, loading, setLoading, update } = useFormState(INITIAL_FORM);
  const rules = useMemo(() => projectRules(t), [t]);
  const statusOptions = useMemo(() => getProjectStatusOptions(t), [t]);
  const progressOptions = useMemo(() => getProjectProgressOptions(t), [t]);
  const { errors, validate, clearErrors } = useValidation<typeof INITIAL_FORM>(rules);
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
      progress: project.progress,
      managerId: project.managerId,
      dueDate: project.dueDate,
    });
    clearErrors();
  }, [isOpen, project, setForm, clearErrors]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function fetchUsers() {
      setLoadingUsers(true);
      try {
        const data = await api.getUsers();
        if (!cancelled) setUsers(data.users);
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    fetchUsers();
    return () => { cancelled = true; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    const selectedManager = users.find((u) => u.email === form.managerId);

    setLoading(true);
    try {
      await api.updateProject(project.projectId, {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        managerId: form.managerId,
        managerName: selectedManager?.name || project.managerName,
        dueDate: form.dueDate,
      });
      showSuccess(t('success.projectUpdated'));
      onUpdated();
      onClose();
    } catch (err) {
      handleApiError(err, showError, 'updating project', t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modal.editProject')} maxWidth="md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="edit-name"
          label={t('form.projectName')}
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          error={errors.name}
        />

        <Textarea
          id="edit-desc"
          label={t('form.description')}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          maxLength={500}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="edit-status"
            label={t('form.status')}
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            options={statusOptions}
          />

          <Select
            id="edit-progress"
            label={t('form.progress')}
            value={form.progress}
            onChange={(e) => update('progress', e.target.value)}
            options={progressOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="edit-manager"
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

          <Input
            id="edit-due"
            label={t('form.dueDate')}
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" isLoading={loading}>
            {loading ? t('form.saving') : t('form.saveChanges')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
