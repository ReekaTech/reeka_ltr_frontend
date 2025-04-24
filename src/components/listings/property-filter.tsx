'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';

interface Option {
  key: string;
  value: string;
}

interface PropertyFilterProps {
  label: string;
  options: Option[];
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value)?.key || value;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Filter by ${label}`}
      >
        <span>{selectedOption}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
          <ul className="py-1" role="listbox" aria-label={`${label} options`}>
            {options.map(option => (
              <li
                key={option.value}
                className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-50 ${
                  option.value === value ? 'bg-gray-50 text-[#e36b37]' : ''
                }`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.key}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
