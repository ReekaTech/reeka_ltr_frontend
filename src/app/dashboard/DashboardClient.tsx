'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { Layout, Tabs, TabsContent } from '@/components/ui';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const { data: session, status } = useSession();

  // Update URL when date range changes
  const updateDateRange = useCallback((start: Date, end: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('startDate', format(start, 'yyyy-MM-dd'));
    params.set('endDate', format(end, 'yyyy-MM-dd'));
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  // Initialize date range from URL params
  useEffect(() => {
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    if (startDateParam && endDateParam) {
      setStartDate(new Date(startDateParam));
      setEndDate(new Date(endDateParam));
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
            {startDate ? (
              endDate ? (
                <>
                  {format(startDate, 'MMM d')} - {format(endDate, 'MMM d')}
                </>
              ) : (
                format(startDate, 'MMM d')
              )
            ) : (
              'Select date range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[100] bg-white" align="end">
          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates as [Date, Date];
              setStartDate(start);
              setEndDate(end);
              if (start && end) {
                updateDateRange(start, end);
              }
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            monthsShown={2}
            inline
            className="border-none"
            calendarClassName="border-none"
            popperPlacement="bottom-end"
            popperClassName="react-datepicker-left"
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
          <Overview />
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