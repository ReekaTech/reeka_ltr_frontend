'use client';

import type { DashboardMetrics } from '@/services/api/schemas/dashboard';
import { MaintenanceCard } from '@/components/dashboard/charts';
import { MetricsCard } from '@/components/dashboard/charts';
import { TenantsCard } from '@/components/dashboard/charts';
import { getDateRangeOption } from '@/lib/utils';
import { usePropertyData } from '@/services/queries/hooks/useDashboard';
import { useSearchParams } from 'next/navigation';

export default function PropertiesClient() {
  const searchParams = useSearchParams();
  
  // Get date range from URL or use default "this year" range
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');
  
  const { startDate, endDate } = startDateParam && endDateParam 
    ? { startDate: startDateParam, endDate: endDateParam }
    : (() => {
        const { startDate: defaultStartDate, endDate: defaultEndDate } = getDateRangeOption('this_year');
        return {
          startDate: defaultStartDate.toISOString().split('T')[0],
          endDate: defaultEndDate.toISOString().split('T')[0]
        };
      })();
  
  const propertyId = searchParams.get('property') || undefined;

  const { data, isLoading } = usePropertyData('', { startDate, endDate, propertyId });

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
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.metrics.map((metric: DashboardMetrics, index: number) => (
          <MetricsCard key={index} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <MaintenanceCard items={data.maintenance} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <TenantsCard tenants={data.tenants} />
        </div>
      </div>
    </>
  );
} 