'use client';

import { useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import { useTranslation } from '@/context/I18nContext';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemName: string;
  onConfirm: () => Promise<void>;
}

export default function ConfirmDeleteModal({ isOpen, onClose, title, itemName, onConfirm }: ConfirmDeleteModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-secondary">
          {t('delete.confirm', { name: itemName })}
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
          <Button variant="destructive" onClick={handleConfirm} isLoading={loading}>
            {loading ? t('form.deleting') : title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
