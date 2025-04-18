'use client';

import { Grid, List, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CreatePortfolioModal } from './create-portfolio-modal';
import type { CreatePortfolioPayload } from '@/services/api/schemas';
import { PortfolioCard } from '@/components/portfolio';
import { cn } from '@/lib/utils';
import { usePortfolios } from '@/components/portfolio';
import { useRouter } from 'next/navigation';

// Mock properties data (replace with actual API data)
const mockProperties = [
  { id: '1', name: 'Hidden Leaf', location: 'Kononah' },
  { id: '2', name: 'Mist Housing', location: 'Lagos' },
  { id: '3', name: 'Ama Nest', location: 'Abuja' },
  { id: '4', name: 'Bancorft Building', location: 'Lagos' },
  { id: '5', name: 'Zest Housing', location: 'Port Harcourt' },
  { id: '6', name: 'Light House', location: 'Ibadan' },
  { id: '7', name: 'Amazon', location: 'Abuja' },
];

interface ContextPortfolioManagementProps {
  onTotalCountChange?: (count: number) => void;
}

export function ContextPortfolioManagement({
  onTotalCountChange,
}: ContextPortfolioManagementProps = {}) {
  const router = useRouter();
  const {
    portfolios,
    isLoading,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    totalCount,
    createPortfolio,
  } = usePortfolios();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Call the callback whenever totalCount changes
  useEffect(() => {
    if (onTotalCountChange && !isLoading) {
      onTotalCountChange(totalCount);
    }
  }, [totalCount, isLoading, onTotalCountChange]);

  const handleSearch = (query: string) => {
    setFilters({ search: query });
  };

  const handleCreatePortfolio = async (
    data: CreatePortfolioPayload,
  ): Promise<void> => {
    console.log(
      'CREATING PORTFOLIO: name:',
      data.name,
      'properties:',
      data.properties?.length || 0,
    );
    try {
      await createPortfolio(data);
      console.log(
        'Portfolio created successfully with',
        data.properties?.length || 0,
        'properties.',
      );
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create portfolio:', err);
    }
  };

  // Navigate to portfolio detail view
  const handlePortfolioClick = (portfolioId: string, portfolioName: string) => {
    router.push(
      `/portfolios/${portfolioId}?name=${encodeURIComponent(portfolioName)}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="w-full md:max-w-md">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={filters.search || ''}
              onChange={e => handleSearch(e.target.value)}
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

      {!isLoading && portfolios.length > 0 && (
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
          {portfolios.map(portfolio => (
            <div
              key={portfolio.id}
              onClick={() => handlePortfolioClick(portfolio.id, portfolio.name)}
              className="cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <PortfolioCard
                name={portfolio.name}
                propertyCount={portfolio.propertyCount}
                viewMode={viewMode}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && portfolios.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {filters.search
              ? `No portfolios found matching "${filters.search}". Try a different search term or create a new portfolio.`
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

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePortfolio}
        properties={mockProperties}
      />
    </div>
  );
}
