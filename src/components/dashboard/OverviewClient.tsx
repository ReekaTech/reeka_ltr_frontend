'use client';

import BurnupChart from '@/components/dashboard/charts/burnup-chart';
import type { DashboardMetrics } from '@/services/api/schemas/dashboard';
import { MaintenanceCard } from '@/components/dashboard/charts';
import { MetricsCard } from '@/components/dashboard/charts';
import { RenewalsCard } from '@/components/dashboard/charts';
import { UnitsCard } from '@/components/dashboard/charts';
import { useOverviewData } from '@/services/queries/hooks/useDashboard';
import { useSearchParams } from 'next/navigation';

export default function OverviewClient() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

  const { data, isLoading } = useOverviewData({ startDate, endDate });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Extract the numeric value from the string (remove currency symbol and commas)
  const totalUnits = parseInt(data.metrics[3]?.value.replace(/[^0-9]/g, '') || '0');

  return (
    <>
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((metric: DashboardMetrics, index: number) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <BurnupChart
            title="Revenue Progress"
            description="Track progress toward your annual revenue target"
            data={data.revenue.chartData}
            target={data.revenue.target}
            summary={data.revenue.summary}
            showDeclines={true}
          />
          <RenewalsCard items={data.renewals} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <UnitsCard totalValue={totalUnits} data={data.units} />
          <MaintenanceCard items={data.maintenance} />
        </div>
      </div>
    </>
  );
} 