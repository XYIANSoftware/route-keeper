'use client';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded ${height} ${width} ${className}`}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="h-4" width={i === lines - 1 ? 'w-3/4' : 'w-full'} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface-0 dark:bg-surface-900 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="space-y-3">
        <Skeleton height="h-6" width="w-1/2" />
        <SkeletonText lines={2} />
        <div className="flex space-x-2">
          <Skeleton height="h-8" width="w-20" />
          <Skeleton height="h-8" width="w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonImage({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-surface-200 dark:bg-surface-700 rounded-lg ${className}`}
      style={{ aspectRatio: '1' }}
    />
  );
}

export function SkeletonButton({ className = '' }: { className?: string }) {
  return <Skeleton height="h-10" width="w-24" className={`rounded-lg ${className}`} />;
}
