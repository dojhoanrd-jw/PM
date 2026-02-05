'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { I18nContext } from '@/context/I18nContext';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <I18nContext.Consumer>
          {(ctx) => {
            const t = ctx?.t || ((k: string) => k);
            return (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-surface p-8">
                <p className="text-sm font-medium text-text-primary">{t('errorPage.somethingWentWrong')}</p>
                <p className="text-xs text-text-secondary">{this.state.error?.message}</p>
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="mt-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  {t('errorPage.tryAgain')}
                </button>
              </div>
            );
          }}
        </I18nContext.Consumer>
      );
    }

    return this.props.children;
  }
}
