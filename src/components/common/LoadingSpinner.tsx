'use client';

import { ProgressSpinner } from 'primereact/progressspinner';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'medium', text, className = '' }: LoadingSpinnerProps) {
  const sizeMap = {
    small: { width: '20px', height: '20px' },
    medium: { width: '40px', height: '40px' },
    large: { width: '60px', height: '60px' },
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <ProgressSpinner style={sizeMap[size]} />
      {text && <p className="text-surface-600 dark:text-surface-400 mt-2">{text}</p>}
    </div>
  );
}
