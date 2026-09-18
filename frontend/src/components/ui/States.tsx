import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div
    role="status"
    style={{
      padding: 'var(--sp-12) var(--sp-8)',
      textAlign: 'center',
      border: '1px dashed var(--color-border)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--color-text-secondary)',
    }}
  >
    <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--fw-medium)', color: 'var(--color-text)', marginBottom: description ? 'var(--sp-2)' : 'var(--sp-4)' }}>
      {title}
    </p>
    {description && (
      <p style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)' }}>{description}</p>
    )}
    {action}
  </div>
);

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading…' }) => (
  <div role="status" aria-live="polite" style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
    <span aria-label={message}>{message}</span>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div
    role="alert"
    style={{
      padding: 'var(--sp-4) var(--sp-5)',
      border: '1px solid var(--color-critical)',
      borderRadius: 'var(--radius-md)',
      backgroundColor: 'var(--color-critical-bg)',
      color: 'var(--color-critical)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--sp-4)',
      fontSize: 'var(--text-sm)',
    }}
  >
    <span>{message}</span>
    {onRetry && (
      <button className="btn btn--secondary btn--sm" type="button" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
);
