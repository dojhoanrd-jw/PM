'use client';

import { useRouter } from 'next/navigation';
import { api, type Project } from '@/lib/api';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError } from '@/hooks';
import { ConfirmDeleteModal } from '@/components/ui';

interface DeleteProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteProjectModal({ project, isOpen, onClose }: DeleteProjectModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { showSuccess, showError } = useAlerts();

  const handleConfirm = async () => {
    try {
      await api.deleteProject(project.projectId);
      showSuccess(t('success.projectDeleted'));
      router.push('/projects');
    } catch (err) {
      handleApiError(err, showError, 'deleting project', t);
    }
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('modal.deleteProject')}
      itemName={project.name}
      onConfirm={handleConfirm}
    />
  );
}
