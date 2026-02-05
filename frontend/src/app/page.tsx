import LoginForm from '@/features/auth/components/LoginForm';
import { LanguageSelector } from '@/components/ui';

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4">
      <LanguageSelector className="absolute top-4 right-4" />
      <LoginForm />
    </div>
  );
}
