import React from 'react';

const STATUS_MAP = {
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

export const Badge = ({ label, variant }) => {
  const resolved = variant ?? STATUS_MAP[label] ?? 'neutral';
  return (
    <span className={`badge badge--${resolved}`} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
};
