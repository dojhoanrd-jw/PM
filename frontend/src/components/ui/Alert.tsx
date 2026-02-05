'use client';

import { useEffect, useState } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  id: string;
  type: AlertType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const typeStyles: Record<AlertType, string> = {
  success: 'bg-status-completed-bg text-status-completed border-status-completed/20',
  error: 'bg-status-delayed-bg text-status-delayed border-status-delayed/20',
  warning: 'bg-status-at-risk-bg text-status-at-risk border-status-at-risk/20',
  info: 'bg-status-ongoing-bg text-status-ongoing border-status-ongoing/20',
};

const icons: Record<AlertType, React.ReactNode> = {
  success: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-8.6 14.86A1 1 0 002.54 20h18.92a1 1 0 00.85-1.28l-8.6-14.86a1 1 0 00-1.72 0z" />
    </svg>
  ),
  info: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  ),
};

export default function Alert({ id, type, message, onClose, duration = 4000 }: AlertProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => setVisible(true));
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
    };
  }, [id, duration, onClose]);

  return (
    <div
      className={`
        flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-sm
        transition-all duration-300
        ${typeStyles[type]}
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <span className="shrink-0">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="shrink-0 opacity-70 hover:opacity-100 cursor-pointer"
        aria-label="Cerrar"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
