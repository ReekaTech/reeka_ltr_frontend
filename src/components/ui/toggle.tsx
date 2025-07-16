'use client';

import { Switch } from 'antd';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onToggle: () => void;
  className?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onToggle, className, disabled = false }: ToggleProps) {
  return (
    <div className="relative">
      <Switch
        checked={checked}
        onChange={onToggle}
        disabled={disabled}
        className={cn(
          "custom-toggle",
          checked && "!bg-green-500",
          className
        )}
        checkedChildren=""
        unCheckedChildren=""
      />
    </div>
  );
} 