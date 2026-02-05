'use client';

import { useTranslation } from '@/context/I18nContext';
import { LOCALES } from '@/i18n';

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <div className={`flex gap-1 ${className}`}>
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
            locale === l.code
              ? 'bg-accent text-white'
              : 'bg-white text-text-secondary hover:bg-surface-hover'
          }`}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
