'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

import type React from 'react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function AccordionItem({
  title,
  icon,
  iconBgColor,
  isExpanded,
  onToggle,
  children,
}: AccordionItemProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-5 shadow-md">
      <div
        className="flex cursor-pointer items-center"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggle();
            e.preventDefault();
          }
        }}
      >
        <div className={cn('mr-3 rounded-md p-1', iconBgColor)}>{icon}</div>
        <h3 className="flex-1 text-sm font-medium">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">{children}</div>
      )}
    </div>
  );
}
