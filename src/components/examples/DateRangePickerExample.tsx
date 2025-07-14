'use client';

import type { DateRangeOption } from '@/lib/utils';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useState } from 'react';

export function DateRangePickerExample() {
  const [fullModeDates, setFullModeDates] = useState<{ startDate: Date; endDate: Date; filterType: DateRangeOption } | null>(null);
  const [customModeDates, setCustomModeDates] = useState<{ startDate: Date; endDate: Date; filterType: DateRangeOption } | null>(null);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold">DateRangePicker Examples</h2>
      
      {/* Full Mode with Predefined Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Full Mode (with predefined options)</h3>
        <DateRangePicker
          showPredefinedOptions={true}
          defaultFilterType="last_30_days"
          onDateRangeChange={(startDate, endDate, filterType) => {
            setFullModeDates({ startDate, endDate, filterType });
          }}
        />
        {fullModeDates && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p><strong>Selected:</strong> {fullModeDates.filterType}</p>
            <p><strong>Start Date:</strong> {fullModeDates.startDate.toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {fullModeDates.endDate.toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Custom Mode Only */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Custom Mode Only</h3>
        <DateRangePicker
          showPredefinedOptions={false}
          defaultFilterType="custom_date_range"
          onDateRangeChange={(startDate, endDate, filterType) => {
            setCustomModeDates({ startDate, endDate, filterType });
          }}
        />
        {customModeDates && (
          <div className="bg-gray-50 p-4 rounded-md">
            <p><strong>Selected:</strong> {customModeDates.filterType}</p>
            <p><strong>Start Date:</strong> {customModeDates.startDate.toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {customModeDates.endDate.toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Disabled State</h3>
        <DateRangePicker
          showPredefinedOptions={true}
          defaultFilterType="this_month"
          disabled={true}
        />
      </div>

      {/* Custom Date Format */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Custom Date Format (MM/DD/YYYY)</h3>
        <DateRangePicker
          showPredefinedOptions={true}
          defaultFilterType="last_7_days"
          dateFormat="MM/DD/YYYY"
          onDateRangeChange={(startDate, endDate, filterType) => {
            console.log('Date range changed:', { startDate, endDate, filterType });
          }}
        />
      </div>
    </div>
  );
} 