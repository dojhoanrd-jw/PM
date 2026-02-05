'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { useTranslation } from '@/context/I18nContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-status-delayed-bg">
          <svg className="h-6 w-6 text-status-delayed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.54 20h18.92a1 1 0 00.85-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-text-primary">{t('errorPage.somethingWentWrong')}</h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t('errorPage.unexpectedError')}
        </p>
        <Button onClick={reset} className="mt-6">
          {t('errorPage.tryAgain')}
        </Button>
      </div>
    </div>
  );
}
