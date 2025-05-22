'use client';

import 'react-day-picker/dist/style.css';

import { Layout, Tabs, TabsContent } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';
import { Calendar } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { DayPicker } from 'react-day-picker';
import Overview from '@/components/dashboard/overview';
import Portfolio from '@/components/dashboard/portfolio';
import Properties from '@/components/dashboard/properties';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import { useSession } from 'next-auth/react';

const tabs = [
  {
    label: 'Overview',
    value: 'overview',
    content: <Overview />,
  },
  {
    label: 'Portfolio',
    value: 'portfolio',
    content: <Portfolio />,
  },
  {
    label: 'Properties',
    value: 'properties',
    content: <Properties />,
  },
];

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const { data: session, status } = useSession();

  // Update URL when date range changes
  const updateDateRange = useCallback((range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('startDate', format(range.from, 'yyyy-MM-dd'));
      params.set('endDate', format(range.to, 'yyyy-MM-dd'));
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams]);

  // Initialize date range from URL params
  useEffect(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      });
    }
  }, [searchParams]);

  const DateRangePicker = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#dcdcdc] bg-white text-[#6d6d6d] hover:bg-gray-50"
          >
            <Calendar className="h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
                </>
              ) : (
                format(dateRange.from, 'MMM d')
              )
            ) : (
              'Select date range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100] bg-white" align="end">
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range);
              updateDateRange(range);
            }}
            numberOfMonths={2}
            defaultMonth={dateRange?.from}
            classNames={{
              months: 'flex flex-row gap-4',
              day_selected: 'bg-[#e36b37] text-white hover:bg-[#e36b37] hover:text-white',
              day_today: 'text-[#e36b37]',
              day_outside: 'text-gray-400',
              day_disabled: 'text-gray-400',
              day_range_middle: 'bg-[#e36b37]/20 text-[#e36b37]',
            }}
          />
        </PopoverContent>
      </Popover>
    );
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Layout title={`${session?.user.organizationName} Dashboard`} description={formatDate(new Date().toISOString())}>
      <div className="space-y-8">
        <Tabs
          items={tabs}
          value={activeTab}
          onValueChange={setActiveTab}
          rightSlot={<DateRangePicker />}
        />

        <TabsContent value="overview" activeValue={activeTab}>
            <Overview  />
        </TabsContent>

        <TabsContent value="portfolio" activeValue={activeTab}>
          <Portfolio />
        </TabsContent>

        <TabsContent value="properties" activeValue={activeTab}>
            <Properties />
        </TabsContent>
      </div>
    </Layout>
  );
} 