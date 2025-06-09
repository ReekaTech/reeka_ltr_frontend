'use client';

import DashboardClient from './DashboardClient';
import { Layout } from '@/components/ui';
import { Suspense } from 'react';
import { usePortfolios } from '@/services/queries/hooks/usePortfolios';
import { useProperties } from '@/services/queries/hooks/useProperties';

function LoadingState() {
  return (
    <Layout title="Loading..." description="Loading dashboard...">
      <div className="space-y-8">
        {/* Tabs skeleton */}
        <div className="flex items-center justify-between border-b border-gray-200">
          <div className="flex space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-24 animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
          {/* Date range picker skeleton */}
          <div className="h-10 w-48 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          {/* Stats grid skeleton */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-80 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-80 animate-pulse rounded-lg bg-gray-200" />
          </div>

          {/* Table skeleton */}
          <div className="space-y-4">
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-md bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Page() {
  const { data: properties } = useProperties({ limit: 5000 });
  const { data: portfolios } = usePortfolios({ limit: 5000 });

  // if (!properties || !portfolios) return <LoadingState />;

  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardClient properties={properties || { items: [], total: 0, page: 1, limit: 10, pages: 1 }} portfolios={portfolios || []} />
    </Suspense>
  );
}
