import React from 'react';

type StatusVariant = 'healthy' | 'warning' | 'critical' | 'info' | 'neutral';

const STATUS_MAP: Record<string, StatusVariant> = {
  Active: 'healthy',
  Healthy: 'healthy',
  Monitoring: 'info',
  Planning: 'neutral',
  'Needs Attention': 'warning',
  Stable: 'info',
  Critical: 'critical',
  Completed: 'neutral',
  Archived: 'neutral',
  Paused: 'neutral',
};

interface BadgeProps {
  label: string;
  variant?: StatusVariant;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  const resolved = variant ?? STATUS_MAP[label] ?? 'neutral';
  return (
    <span className={`badge badge--${resolved}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
};
