'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PropertyFilterProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function PropertyFilter({
  label,
  options,
  value,
  onChange,
}: PropertyFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Filter by ${label}`}
      >
        <span>{value}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="py-1" role="listbox" aria-label={`${label} options`}>
            {options.map(option => (
              <li
                key={option}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 ${
                  option === value ? 'bg-gray-50 text-[#e36b37]' : ''
                }`}
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
