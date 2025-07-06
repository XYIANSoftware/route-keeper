'use client';

import { Button } from 'primereact/button';
import { EmptyStateProps } from '@/types';

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center p-8 ${className}`}>
      <i className={`${icon} text-4xl text-surface-400 mb-4`}></i>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2">{title}</h3>
      <p className="text-surface-600 dark:text-surface-400 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={onAction}
        />
      )}
    </div>
  );
}
