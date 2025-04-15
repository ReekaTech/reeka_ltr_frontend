'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface TabItem {
  label: string;
  value: string;
  href?: string;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onValueChange, className }: TabsProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    value || items[0]?.value || '',
  );

  // Update active tab when value prop changes
  useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);

  const handleTabClick = (item: TabItem) => {
    if (item.disabled) return;

    if (!item.href) {
      setActiveTab(item.value);
      onValueChange?.(item.value);
    }
  };

  return (
    <div className={cn('w-full border-b border-gray-200', className)}>
      <div className="relative flex w-full items-center justify-between">
        <div className="flex items-center space-x-8">
          {items.map((item, index) => {
            const isActive = item.href
              ? pathname === item.href
              : activeTab === item.value;

            const TabComponent = item.href ? Link : 'button';

            return (
              <TabComponent
                key={index}
                href={item.href || '#'}
                onClick={() => handleTabClick(item)}
                type={item.href ? undefined : 'button'}
                className={cn(
                  'relative px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700',
                  isActive && 'text-[#e36b37]',
                  item.disabled && 'cursor-not-allowed opacity-50',
                  !item.href && 'cursor-pointer border-none bg-transparent',
                )}
                aria-disabled={item.disabled}
              >
                {item.label}
                {isActive && (
                  <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-[#e36b37]" />
                )}
              </TabComponent>
            );
          })}
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-px bg-black opacity-10 shadow-sm" />
      </div>
    </div>
  );
}

export function TabsContent({
  value,
  activeValue,
  children,
  className,
}: {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  return activeValue === value ? (
    <div className={cn('mt-6', className)}>{children}</div>
  ) : null;
}

export const TabsList = () => null;
export const TabsTrigger = () => null;
