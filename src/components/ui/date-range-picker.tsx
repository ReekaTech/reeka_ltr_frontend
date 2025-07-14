'use client';

import { Calendar } from 'lucide-react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { getDateRangeOption, getDateRangeLabel, type DateRangeOption } from '@/lib/utils';

const { RangePicker } = DatePicker;

export interface DateRangePickerProps {
  /**
   * Whether to show the full dropdown with predefined options
   * If false, only shows the custom date range picker
   */
  showPredefinedOptions?: boolean;
  
  /**
   * Default date range option
   */
  defaultFilterType?: DateRangeOption;
  
  /**
   * Callback when date range changes
   */
  onDateRangeChange?: (startDate: Date, endDate: Date, filterType: DateRangeOption) => void;
  
  /**
   * Custom CSS classes for the container
   */
  className?: string;
  
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  
  /**
   * Format for the date display
   */
  dateFormat?: string;
}

export function DateRangePicker({
  showPredefinedOptions = true,
  defaultFilterType = 'this_year',
  onDateRangeChange,
  className = '',
  disabled = false,
  dateFormat = 'DD/MM/YYYY'
}: DateRangePickerProps) {
  const [filterType, setFilterType] = useState<DateRangeOption>(defaultFilterType);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Initialize default date range
  useEffect(() => {
    const { startDate: defaultStartDate, endDate: defaultEndDate } = getDateRangeOption(defaultFilterType);
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setFilterType(defaultFilterType);
  }, [defaultFilterType]);

  const handleFilterTypeChange = (value: string) => {
    const typedValue = value as DateRangeOption;
    setFilterType(typedValue);
    
    if (typedValue !== 'custom_date_range') {
      const { startDate: newStartDate, endDate: newEndDate } = getDateRangeOption(typedValue);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onDateRangeChange?.(newStartDate, newEndDate, typedValue);
    }
  };

  const handleCustomDateChange = (dates: any) => {
    if (!dates || !dates[0] || !dates[1]) {
      const today = new Date();
      setStartDate(today);
      setEndDate(today);
      onDateRangeChange?.(today, today, 'custom_date_range');
    } else {
      const start = dates[0].toDate();
      const end = dates[1].toDate();
      setStartDate(start);
      setEndDate(end);
      onDateRangeChange?.(start, end, 'custom_date_range');
    }
  };

  const containerClasses = `flex items-center gap-2 bg-white border border-solid rounded-md py-2 px-3 w-fit ${className}`;

  return (
    <div className={containerClasses}>
      <Calendar className="h-4 w-4" />
      
      {showPredefinedOptions ? (
        // Full dropdown with predefined options
        filterType === "custom_date_range" ? (
          <div className="flex items-center gap-2">
            <RangePicker
              format={dateFormat}
              value={[dayjs(startDate), dayjs(endDate)]}
              onChange={handleCustomDateChange}
              className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent"
              disabled={disabled}
            />
            <button
              className="switch-to-predefined ml-2"
              onClick={() => handleFilterTypeChange("this_year")}
              disabled={disabled}
            >
              Switch to Predefined Options
            </button>
          </div>
        ) : (
          <select
            value={filterType}
            onChange={(e) => handleFilterTypeChange(e.target.value)}
            className="date-range-select"
            disabled={disabled}
          >
            <option value="this_year">{getDateRangeLabel('this_year')}</option>
            <option value="last_7_days">{getDateRangeLabel('last_7_days')}</option>
            <option value="last_90_days">{getDateRangeLabel('last_90_days')}</option>
            <option value="this_month">{getDateRangeLabel('this_month')}</option>
            <option value="this_year">{getDateRangeLabel('this_year')}</option>
            <option value="custom_date_range">{getDateRangeLabel('custom_date_range')}</option>
          </select>
        )
      ) : (
        // Only custom date range picker
        <RangePicker
          format={dateFormat}
          value={[dayjs(startDate), dayjs(endDate)]}
          onChange={handleCustomDateChange}
          className="outline-none text-secondary text-xs md:text-sm appearance-none border-none bg-transparent"
          disabled={disabled}
        />
      )}
    </div>
  );
} 