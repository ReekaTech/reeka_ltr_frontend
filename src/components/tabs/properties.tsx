import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Sample properties data
const properties = [
  {
    id: 'amas-nest',
    name: "Ama's Nest",
    location: '24 Drive, Lagos Island, Nigeria',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 'zest-housing',
    name: 'Zest Housing',
    location: 'Lekki, Lagos',
    image: '/placeholder.svg?height=400&width=600',
  },
  {
    id: 'bancroft-housing',
    name: 'Bancroft Housing',
    location: 'Boji, OTA',
    image: '/placeholder.svg?height=400&width=600',
  },
];

interface PropertiesTabProps {
  searchTerm: string;
  viewMode: 'grid' | 'list';
  portfolioId?: string;
}

export function PropertiesTab({ searchTerm, viewMode, portfolioId }: PropertiesTabProps) {
  // Filter properties based on search term
  const filteredProperties = properties.filter(
    property =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (filteredProperties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No properties found matching "${searchTerm}". Try a different search term.`
            : 'No properties found in this portfolio.'}
        </p>
        <Link
          href="/listings/add-property"
          className="hover:bg-opacity-90 mt-4 inline-block rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all"
        >
          Add Property to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1',
      )}
      role="list"
      aria-label="Portfolio Properties"
    >
      {filteredProperties.map(property => (
        <div
          key={property.id}
          className={cn(
            'group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md',
            viewMode === 'list' && 'flex',
          )}
        >
          <div
            className={cn(
              'relative',
              viewMode === 'grid' ? 'h-48 w-full' : 'h-24 w-24 flex-shrink-0',
            )}
          >
            <Image
              src={property.image || '/placeholder.svg'}
              alt={property.name}
              fill
              className="object-cover"
            />
          </div>
          <div
            className={cn(
              'p-4',
              viewMode === 'list' &&
                'flex flex-grow items-center justify-between',
            )}
          >
            <div>
              <h3 className="font-medium text-gray-900">{property.name}</h3>
              <p className="text-sm text-gray-500">{property.location}</p>
            </div>
            {viewMode === 'list' && (
              <div className="ml-4 flex items-center">
                <Link
                  href={`/listings/property/${property.id}`}
                  className="text-sm font-medium text-[#e36b37] hover:underline"
                >
                  View Property
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
