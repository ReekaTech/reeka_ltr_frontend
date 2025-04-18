import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioCardProps {
  name: string;
  propertyCount: number;
  viewMode: 'list' | 'grid';
}

export function PortfolioCard({
  name,
  propertyCount,
  viewMode,
}: PortfolioCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-gray-100 bg-[#FAFAFA] p-6 transition-shadow hover:shadow-md',
        viewMode === 'list' && 'flex items-center',
      )}
    >
      <div
        className={cn(
          'flex',
          viewMode === 'list'
            ? 'flex-row items-center'
            : 'flex-col items-start',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-lg bg-gray-50 p-4',
            viewMode === 'list' ? 'mr-4' : 'mb-4 self-start',
          )}
        >
          <Building2 className="h-6 w-6 text-gray-400" />
        </div>
        <div className="text-left">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {propertyCount} Properties
          </p>
        </div>
      </div>
    </div>
  );
}
