'use client';

import BurnupChart from '@/components/dashboard/charts/burnup-chart';
import type { DashboardMetrics } from '@/services/api/schemas/dashboard';
import { MaintenanceCard } from '@/components/dashboard/charts';
import { MetricsCard } from '@/components/dashboard/charts';
import { PropertiesCard } from '@/components/dashboard/charts';
import { RenewalsCard } from '@/components/dashboard/charts';
import { UnitsCard } from '@/components/dashboard/charts';
import { usePortfolioData } from '@/services/queries/hooks/useDashboard';
import { useSearchParams } from 'next/navigation';

export default function PortfolioClient() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  const portfolioId = searchParams.get('portfolio') || undefined;

  const { data, isLoading } = usePortfolioData({ startDate, endDate, portfolioId });

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
          <PropertiesCard properties={data.properties} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <UnitsCard totalValue={100} data={data.units} />
          <RenewalsCard items={data.renewals} />
          <MaintenanceCard items={data.maintenance} />
        </div>
      </div>
    </>
  );
} 