'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/I18nContext';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-accent">{t('errorPage.notFound')}</p>
        <h1 className="mt-4 text-xl font-semibold text-text-primary">
          {t('errorPage.pageNotFound')}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {t('errorPage.pageNotFoundDesc')}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          {t('errorPage.backToHome')}
        </Link>
      </div>
    </div>
  );
}
