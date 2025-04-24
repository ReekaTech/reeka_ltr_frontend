'use client';

import type { CreatePortfolioPayload, Portfolio, Property } from '@/services/api/schemas';
import { Grid, List, Search } from 'lucide-react';
import { useCreatePortfolio, usePortfolios, useUnassignedProperties } from '@/services/queries/hooks';
import { useEffect, useState } from 'react';

import { CreatePortfolioModal } from './create-portfolio-modal';
import { PortfolioCard } from '@/components/portfolio';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ContextPortfolioManagementProps {
  onTotalCountChange?: (count: number) => void;
}

export function ContextPortfolioManagement({
  onTotalCountChange,
}: ContextPortfolioManagementProps = {}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [transformedProperties, setTransformedProperties] = useState<Partial<Property>[]>([]);

  // Use the hook to fetch unassigned properties
  const { data: unassignedProperties } = useUnassignedProperties();

  // Transform properties when they are fetched
  useEffect(() => {
    if (unassignedProperties) {
      const transformed = unassignedProperties.map(property => ({
        _id: property._id,
        name: property.name,
      }));
      setTransformedProperties(transformed);
    }
  }, [unassignedProperties]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('portfolioViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('portfolioViewMode', viewMode);
  }, [viewMode]);

  // Fetch portfolios
  const { data: portfolios = [], isLoading } = usePortfolios({
    search: debouncedSearchTerm,
  });

  useEffect(() => {
    if (portfolios) {
      onTotalCountChange?.(portfolios.length);
    }
  }, [portfolios, onTotalCountChange]);

  const createPortfolioMutation = useCreatePortfolio();

  const handleCreatePortfolio = async (data: CreatePortfolioPayload): Promise<void> => {
    try {
      await createPortfolioMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
    }
  };

  const handlePortfolioClick = (portfolioId: string) => {
    router.push(`/listings/portfolio/${portfolioId}`);
  };


  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex-1">
        {/* Search and Actions */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center mb-6">
          <div className="w-full md:max-w-md">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                aria-label="Search portfolios"
              />
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            {/* View toggle */}
            <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400',
                )}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400',
                )}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>

            {/* Create Portfolio button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
            >
              Create Portfolio
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
          </div>
        )}

        {/* Portfolios grid */}
        {!isLoading && portfolios?.length > 0 && (
          <div
            className={cn(
              'grid gap-6',
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1',
            )}
            role="list"
            aria-label="Portfolios"
          >
            {portfolios.map((portfolio: Portfolio) => (
              <div
                key={portfolio._id}
                onClick={() => handlePortfolioClick(portfolio._id)}
                className="cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <PortfolioCard
                  name={portfolio.name}
                  propertyCount={portfolio.propertyCount || 0}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && portfolios.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? `No portfolios found matching "${searchTerm}". Try a different search term or create a new portfolio.`
                : 'No portfolios found. Create a new portfolio to get started.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all"
            >
              Create Portfolio
            </button>
          </div>
        )}
      </div>
    

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePortfolio}
        properties={transformedProperties}
      />
    </div>
  );
}
