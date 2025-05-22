'use client';

import { MaintenanceCard, MetricsCard, PropertiesCard, RenewalsCard, UnitsCard } from './charts';

import { DashboardMetrics } from '@/services/api/schemas/dashboard';
import PortfolioClient from './PortfolioClient';
import { Suspense } from 'react';
import { usePortfolioData } from '@/services/queries/hooks/useDashboard';
import { useSearchParams } from 'next/navigation';

function LoadingState() {
  return (
    <>
      {/* Metrics grid skeleton */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>

      {/* Charts and cards grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Renewals Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
          {/* Properties Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Units Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
          {/* Maintenance Card skeleton */}
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </>
  );
}

export default function Portfolio() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PortfolioClient />
    </Suspense>
  );
}
