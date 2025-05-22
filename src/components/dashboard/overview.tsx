'use client';

import { MaintenanceCard, MetricsCard, MiniBarChartCard, RenewalsCard, UnitsCard } from './charts';

import BurnupChart from './charts/burnup-chart';
import { DashboardMetrics } from '@/services/api/schemas/dashboard';
import OverviewClient from './OverviewClient';
import { Suspense } from 'react';
import { useOverviewData } from '@/services/queries/hooks/useDashboard';
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
          {/* Burnup Chart skeleton */}
          <div className="h-80 animate-pulse rounded-lg bg-gray-200" />
          {/* Renewals Card skeleton */}
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

export default function Overview() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OverviewClient />
    </Suspense>
  );
}
