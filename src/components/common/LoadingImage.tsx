'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SkeletonImage } from './Skeleton';

interface LoadingImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function LoadingImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: LoadingImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`bg-surface-200 dark:bg-surface-700 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <i className="pi pi-image text-surface-400 text-xl" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0">
          <SkeletonImage className="w-full h-full" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: 'auto', height: 'auto' }}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
