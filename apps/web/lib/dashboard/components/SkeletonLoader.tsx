import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
}

// Simple skeleton loader – renders gray blocks to simulate loading content.
export default function SkeletonLoader({ rows = 3 }: SkeletonLoaderProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="h-4 bg-gray-200 rounded animate-pulse"
        />
      ))}
    </div>
  );
}
