import { ApiError, NetworkError } from '@/lib/errors';
import type { TFn } from '@/context/I18nContext';

export function handleApiError(
  err: unknown,
  showError: (msg: string) => void,
  context: string,
  t: TFn,
): void {
  if (err instanceof NetworkError) {
    showError(t('error.noConnection'));
  } else if (err instanceof ApiError) {
    showError(err.message);
  } else {
    showError(t('error.unexpected', { context }));
  }
}
