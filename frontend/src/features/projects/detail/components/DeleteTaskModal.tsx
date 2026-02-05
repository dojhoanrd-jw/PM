'use client';

import { api, type Task } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError } from '@/hooks';
import { ConfirmDeleteModal } from '@/components/ui';

interface DeleteTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteTaskModal({ task, isOpen, onClose, onDeleted }: DeleteTaskModalProps) {
  const { t } = useTranslation();
  const { showSuccess, showError } = useAlerts();

  const handleConfirm = async () => {
    try {
      await api.deleteTask(task.taskId, task.projectId);
      showSuccess(t('success.taskDeleted'));
      onDeleted();
      onClose();
    } catch (err) {
      handleApiError(err, showError, 'deleting task', t);
    }
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('tasks.deleteTask')}
      itemName={task.title}
      onConfirm={handleConfirm}
    />
  );
}
