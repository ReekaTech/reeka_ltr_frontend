import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/services/api/schemas/property';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  viewMode: 'grid' | 'list';
}

export function PropertyCard({ property, viewMode }: PropertyCardProps) {
  // Helper function to get room display text
  const getRoomDisplayText = () => {
    if (property.rooms.bedrooms === 0) {
      return `Studio • ${property.rooms.bathrooms} ${property.rooms.bathrooms === 1 ? 'Bath' : 'Baths'}`;
    } else {
      return `${property.rooms.bedrooms} ${property.rooms.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} • ${property.rooms.bathrooms} ${property.rooms.bathrooms === 1 ? 'Bath' : 'Baths'}`;
    }
  };

  return (
    <Link href={`/listings/property/${property._id}`} className='cursor-pointer'>
      <div
        className={cn(
          'overflow-hidden rounded-lg border border-gray-100 bg-white transition-all hover:shadow-md p-3',
          viewMode === 'list' && 'flex',
        )}
      >
        {/* Property image */}
        <div
          className={cn(
            'relative overflow-hidden mb-3',
            viewMode === 'grid' ? 'h-48' : 'h-32 w-48 flex-shrink-0 mr-4',
          )}
        >
          <Image
            src={property.imageUrls[0] || '/placeholder.svg'}
            alt={property.name}
            fill
            className="object-cover"
            sizes={viewMode === 'grid' ? '100vw' : '33vw'}
          />
        </div>

        {/* Property details */}
        <div>
          <h3 className="font-light text-[10px] text-gray-900">{property.name}</h3>
          <p className="text-[8px] font-light text-gray-500">{property.address}</p>
          <p className="text-[8px] font-medium text-gray-600 mt-1">
            {getRoomDisplayText()}
          </p>
        </div>
      </div>
    </Link>
  );
}
