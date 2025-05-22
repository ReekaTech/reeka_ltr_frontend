import PropertiesClient from './PropertiesClient';
import { Suspense } from 'react';

function LoadingState() {
  return (
    <>
      {/* Metrics grid skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>

      {/* Charts and cards grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Maintenance Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Tenants Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </>
  );
}

export default function Properties() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PropertiesClient />
    </Suspense>
  );
}
