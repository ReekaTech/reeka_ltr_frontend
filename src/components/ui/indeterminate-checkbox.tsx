'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as React from 'react';

import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

interface IndeterminateCheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  IndeterminateCheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => (
  <div className="relative inline-block">
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-gray-200 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        indeterminate ? 'bg-white text-gray-900' : checked ? 'bg-gray-900 text-gray-50' : 'bg-white',
        className
      )}
      checked={checked}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
    {indeterminate && (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Minus className="h-4 w-4 stroke-2 text-gray-900" />
      </div>
    )}
  </div>
));
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox';

export { IndeterminateCheckbox }; 