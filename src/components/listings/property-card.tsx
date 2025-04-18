import Image from 'next/image';
import { cn } from '@/lib/utils';

type Property = {
  id: string;
  name: string;
  location: string;
  subLocation?: string;
  image: string;
};

interface PropertyCardProps {
  property: Property;
  viewMode: 'grid' | 'list';
}

export function PropertyCard({ property, viewMode }: PropertyCardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border border-gray-100 bg-white transition-all hover:shadow-md',
        viewMode === 'list' && 'flex',
      )}
    >
      {/* Property image */}
      <div
        className={cn(
          'relative overflow-hidden',
          viewMode === 'grid' ? 'h-48' : 'h-32 w-48 flex-shrink-0',
        )}
      >
        <Image
          src={property.image || '/placeholder.svg'}
          alt={property.name}
          fill
          className="object-cover"
          sizes={viewMode === 'grid' ? '100vw' : '33vw'}
        />
      </div>

      {/* Property details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{property.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{property.location}</p>
      </div>
    </div>
  );
}
