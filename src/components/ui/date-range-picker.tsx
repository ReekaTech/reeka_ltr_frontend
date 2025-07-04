'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { Button } from './button';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { useState } from 'react';

interface DateRangePickerProps {
  value: { from: string; to: string } | null;
  onChange: (range: { from: string; to: string } | null) => void;
  requiredEndDate?: boolean;
  className?: string;
}

export function DateRangePicker({ value, onChange, requiredEndDate = false, className = '' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const fromDate = value?.from ? new Date(value.from) : null;
  const toDate = value?.to ? new Date(value.to) : null;

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start && end) {
      onChange({
        from: start.toISOString().split('T')[0],
        to: end.toISOString().split('T')[0],
      });
    } else if (start) {
      onChange({
        from: start.toISOString().split('T')[0],
        to: '',
      });
    } else {
      onChange(null);
    }
  };

  const displayValue = fromDate && toDate 
    ? `${format(fromDate, 'MMM dd, yyyy')} - ${format(toDate, 'MMM dd, yyyy')}`
    : fromDate 
    ? `${format(fromDate, 'MMM dd, yyyy')} - Select end date`
    : 'Select date range';

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {displayValue}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1">
          <DatePicker
            selected={fromDate}
            onChange={handleDateChange}
            startDate={fromDate}
            endDate={toDate}
            selectsRange
            inline
            maxDate={new Date()}
            dateFormat="MMM dd, yyyy"
            className="border border-gray-200 rounded-lg shadow-lg bg-white"
            popperClassName="z-50"
            onCalendarClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
} 