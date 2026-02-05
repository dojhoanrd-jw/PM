'use client';

import { memo, useEffect, useMemo } from 'react';
import { api, type Task, type Project, type ProjectMember } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useFormState, useValidation } from '@/hooks';
import { taskRules } from '../validation';
import { getTaskStatusOptions, getTaskPriorityOptions, getTaskCategoryOptions } from '@/lib/constants';
import { Button, Input, Textarea, Select, Modal } from '@/components/ui';

interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  status: string;
  priority: string;
  category: string;
  assigneeId: string;
  assigneeName: string;
  estimatedHours: string;
  dueDate: string;
}

const INITIAL_FORM: TaskFormData = {
  title: '', description: '', projectId: '', status: 'todo', priority: 'medium',
  category: 'important', assigneeId: '', assigneeName: '', estimatedHours: '', dueDate: '',
};

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  mode: 'create' | 'edit';
  initialData?: Task;
  /** Fixed project (project-scoped usage) */
  projectId?: string;
  /** Fixed members list (project-scoped usage) */
  members?: ProjectMember[];
  /** All projects (global usage — user picks project) */
  projects?: Project[];
  /** User role for conditional "Approved" status */
  userRole?: string;
}

export default memo(function TaskFormModal({
  isOpen, onClose, onSaved, mode, initialData,
  projectId, members, projects, userRole,
}: TaskFormModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();
  const { form, setForm, loading, setLoading, update } = useFormState(INITIAL_FORM);

  const taskStatusOptions = useMemo(() => getTaskStatusOptions(t), [t]);
  const taskPriorityOptions = useMemo(() => getTaskPriorityOptions(t), [t]);
  const taskCategoryOptions = useMemo(() => getTaskCategoryOptions(t), [t]);

  const rules = useMemo(() => taskRules(t, { projects, mode }), [t, projects, mode]);

  const { errors, setErrors, validate, clearErrors } = useValidation<TaskFormData>(rules);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && initialData) {
      setForm({
        title: initialData.title,
        description: initialData.description || '',
        projectId: initialData.projectId,
        status: initialData.status,
        priority: initialData.priority,
        category: initialData.category || 'important',
        assigneeId: initialData.assigneeId,
        assigneeName: initialData.assigneeName,
        estimatedHours: String(initialData.estimatedHours),
        dueDate: initialData.dueDate,
      });
    } else {
      setForm({ ...INITIAL_FORM, projectId: projectId || '' });
    }
    clearErrors();
  }, [isOpen, mode, initialData, projectId, setForm, clearErrors]);

  const availableMembers: ProjectMember[] = useMemo(() => {
    if (members) return members;
    if (!projects || !form.projectId) return [];
    const project = projects.find((p) => p.projectId === form.projectId);
    return project?.members || [];
  }, [members, projects, form.projectId]);

  const handleProjectChange = (value: string) => {
    setForm((prev) => ({ ...prev, projectId: value, assigneeId: '', assigneeName: '' }));
    if (errors.projectId) setErrors((prev) => ({ ...prev, projectId: undefined }));
  };

  const handleAssigneeChange = (email: string) => {
    const member = availableMembers.find((m) => m.email === email);
    setForm((prev) => ({ ...prev, assigneeId: email, assigneeName: member?.name || '' }));
    if (errors.assigneeId) setErrors((prev) => ({ ...prev, assigneeId: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(form)) return;

    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        projectId: projectId || form.projectId,
        status: form.status,
        priority: form.priority,
        category: form.category,
        assigneeId: form.assigneeId,
        assigneeName: form.assigneeName,
        estimatedHours: Number(form.estimatedHours),
        dueDate: form.dueDate,
      };

      if (mode === 'edit' && initialData) {
        await api.updateTask(initialData.taskId, payload);
        showSuccess(t('success.taskUpdated'));
      } else {
        await api.createTask(payload);
        showSuccess(t('success.taskCreated'));
      }
      onSaved();
      onClose();
    } catch (err) {
      handleApiError(err, showError, `${mode === 'edit' ? 'updating' : 'creating'} task`, t);
    } finally {
      setLoading(false);
    }
  };

  const canApprove = userRole === 'owner' || userRole === 'project_manager' || userRole === 'admin';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? t('modal.editTask') : t('modal.createTask')} maxWidth="md">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="tf-title"
          label={t('form.title')}
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          error={errors.title}
        />

        <Textarea
          id="tf-desc"
          label={t('form.description')}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={2}
          maxLength={500}
        />

        {projects && (
          <Select
            id="tf-project"
            label={t('form.project')}
            value={form.projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            disabled={mode === 'edit'}
            error={errors.projectId}
            placeholder={t('form.selectProject')}
          >
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>{p.name}</option>
            ))}
          </Select>
        )}

        <div className="grid grid-cols-3 gap-4">
          <Select id="tf-status" label={t('form.status')} value={form.status} onChange={(e) => update('status', e.target.value)}>
            {taskStatusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
            {canApprove && <option value="approved">{t('status.approved')}</option>}
          </Select>
          <Select
            id="tf-priority"
            label={t('form.priority')}
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
            options={taskPriorityOptions}
          />
          <Select
            id="tf-category"
            label={t('form.category')}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            options={taskCategoryOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="tf-assignee"
            label={t('form.assignee')}
            value={form.assigneeId}
            onChange={(e) => handleAssigneeChange(e.target.value)}
            disabled={projects ? !form.projectId : false}
            error={errors.assigneeId}
            placeholder={projects && !form.projectId ? t('form.selectProjectFirst') : t('form.selectAssignee')}
          >
            {availableMembers.map((m) => (
              <option key={m.email} value={m.email}>{m.name}</option>
            ))}
          </Select>
          <Input
            id="tf-hours"
            label={t('form.estimatedHours')}
            type="number"
            min="0.5"
            step="0.5"
            value={form.estimatedHours}
            onChange={(e) => update('estimatedHours', e.target.value)}
            error={errors.estimatedHours}
          />
        </div>

        <Input
          id="tf-due"
          label={t('form.dueDate')}
          type="date"
          min={mode === 'create' ? new Date().toISOString().split('T')[0] : undefined}
          value={form.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
          error={errors.dueDate}
        />

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
          <Button type="submit" isLoading={loading}>
            {loading ? (mode === 'edit' ? t('form.saving') : t('form.creating')) : (mode === 'edit' ? t('form.saveChanges') : t('form.createTask'))}
          </Button>
        </div>
      </form>
    </Modal>
  );
});
