'use client';

import { LayoutGrid, List, Search } from 'lucide-react';
import { PropertyCard, PropertyFilter } from '@/components/listings';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { Pagination } from '@/components/ui';
import { Tabs } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useProperties } from '@/services/queries/hooks';

// Filter options
const statusOptions = [
  { key: 'Listed', value: 'listed' },
  { key: 'Unlisted', value: 'unlisted' },
  { key: 'All', value: 'all' }
];

interface EnhancedPropertyListingsProps {
  onTotalCountChange?: (count: number) => void;
  portfolioId?: string;
}

export function EnhancedPropertyListings({
  onTotalCountChange,
  portfolioId,
}: EnhancedPropertyListingsProps = {}) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('propertyViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('propertyViewMode', viewMode);
  }, [viewMode]);

  // Fetch properties with filters
  const { data, isLoading } = useProperties({
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    search: debouncedSearchTerm,
    page: currentPage,
    limit,
    portfolioId,
  });

  const properties = data?.items || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.pages || 1;

  // Update the count whenever properties change
  useEffect(() => {
    if (onTotalCountChange && !isLoading) {
      onTotalCountChange(totalCount);
    }
  }, [totalCount, isLoading, onTotalCountChange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex-1">
        {/* Filters and search */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mb-6">
          <div className="flex flex-wrap gap-3">
            {/* Status filter */}
            <PropertyFilter
              label="Status"
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            {/* Search */}
            <div className="relative w-full flex-grow md:w-auto">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Search properties"
              />
            </div>

            {/* View toggle */}
            <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
              <button
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400',
                )}
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400',
                )}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>

            {/* Add property button */}
            <Link
              href="/listings/add-property"
              className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
            >
              Add Property
            </Link>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
          </div>
        )}

        {/* Property grid - only show when not loading and there are properties */}
        {!isLoading && properties?.length > 0 && (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1',
            )}
            role="list"
            aria-label="Properties"
          >
            {properties.map(property => (
              <PropertyCard
                key={property._id}
                property={property}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Empty state - only show when not loading and there are no properties */}
        {!isLoading && properties.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {debouncedSearchTerm || selectedStatus !== 'all'
                ? 'No properties found matching your filters. Try adjusting your search or filters.'
                : 'No properties found. Add a new property to get started.'}
            </p>
            <Link
              href="/listings/add-property"
              className="hover:bg-opacity-90 mt-4 inline-block rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all"
            >
              Add Property
            </Link>
          </div>
        )}
      </div>

      {/* Pagination - always at the bottom */}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
