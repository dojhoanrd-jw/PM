'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { storage } from '@/lib/storage';
import { useAlerts } from '@/context/AlertContext';
import { useTranslation } from '@/context/I18nContext';
import { handleApiError, useValidation } from '@/hooks';
import { loginRules } from '../validation';
import { Button, Input, Card } from '@/components/ui';
import { AddUserIcon } from '@/components/icons';

interface LoginFormData { email: string; password: string }

export default function LoginForm() {
  const router = useRouter();
  const { showError } = useAlerts();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const rules = useMemo(() => loginRules(t), [t]);
  const { errors, validate } = useValidation<LoginFormData>(rules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate({ email, password })) return;
    setLoading(true);

    try {
      const data = await api.login(email, password);
      storage.setToken(data.token);
      storage.setUser(data.user);
      router.push('/dashboard');
    } catch (err) {
      handleApiError(err, showError, 'signing in', t);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card padding="md" className="w-full max-w-sm sm:p-8">
      <div className="mb-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light">
          <AddUserIcon className="h-5 w-5 text-accent" />
        </div>
        <h1 className="text-xl font-semibold text-text-primary">{t('login.welcome')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          id="email"
          label={t('login.email')}
          type="email"
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <Input
          id="password"
          label={t('login.password')}
          type="password"
          placeholder={t('login.passwordPlaceholder')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <Button type="submit" isLoading={loading} className="mt-2 w-full">
          {loading ? t('login.signingIn') : t('login.signIn')}
        </Button>
      </form>

      {process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && (
        <p className="mt-5 text-center text-xs text-text-muted">
          {t('login.demoCredentials')}
        </p>
      )}
    </Card>
  );
}
