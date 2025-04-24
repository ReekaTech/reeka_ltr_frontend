'use client';

import { AddExpenseModal, AddTicketModal } from '@/components/portfolio';
import { ArrowLeft, LayoutGrid, List, Search } from 'lucide-react';
import { ExpensesTab, MaintenanceTab, PropertiesTab } from '@/components/tabs';
import { Pagination, Tabs, TabsContent } from '@/components/ui';
import { PropertyCard, PropertyFilter } from '@/components/listings';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePortfolio, useProperties } from '@/services/queries/hooks';

import { Layout } from '@/components/ui';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Filter options
const statusOptions = [
  { key: 'Listed', value: 'listed' },
  { key: 'Unlisted', value: 'unlisted' },
  { key: 'All', value: 'all' }
];

export default function PortfolioDetail() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const [activeTab, setActiveTab] = useState('properties');
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);


  const handleGoBack = () => {
    router.back();
  };

  const tabs = [
    { label: 'Properties', value: 'properties' },
    { label: 'Expenses', value: 'expenses' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem('propertyViewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode as 'grid' | 'list');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('propertyViewMode', viewMode);
  }, [viewMode]);

  const { data: portfolio, isLoading: isPortfolioLoading } = usePortfolio(id);

  const { data, isLoading: isPropertiesLoading } = useProperties({
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    portfolioId: id,
    search: debouncedSearchTerm,
    page: currentPage,
    limit,
  });

  const properties = data?.items || [];
  const totalCount = data?.total || 0;
  const totalPages = data?.pages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
 

  return (
    <Layout title={portfolio?.name} description="This is the portfolio details page">
      <div className="flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex-1">
          {/* Back button */}
          <div className="flex items-center text-sm text-gray-500">
            <button
              onClick={handleGoBack}
              className="flex items-center hover:text-gray-700 cursor-pointer"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Portfolio Management</span>
            </button>
            <span className="mx-2">/</span>
            <span>Portfolio Details</span>
          </div>

          {/* Tabs */}
          <Tabs
            items={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
            rightSlot={
              <div className="text-xs font-light text-gray-500">
                {totalCount}{' '}
                {totalCount === 1 ? 'Property' : 'Properties'}
              </div>
            }
          />

          {/* Search and actions - only show for expenses and maintenance tabs */}
          {activeTab !== 'properties' && (
            <div className="mt-6 mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="relative w-full sm:max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${activeTab}`}
                  className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === 'expenses' && (
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="hover:bg-opacity-90 rounded-md cursor-pointer bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
                >
                  Add Expense
                </button>
              )}

              {activeTab === 'maintenance' && (
                <button
                  onClick={() => setIsTicketModalOpen(true)}
                  className="hover:bg-opacity-90 rounded-md cursor-pointer bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
                >
                  Add Ticket
                </button>
              )}
            </div>
          )}

          <TabsContent value="properties" activeValue={activeTab}>
            <div>
              {/* Search and filters */}
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center my-6">
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
              {isPropertiesLoading && (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
                </div>
              )}

              {/* Properties grid */}
              {!isPropertiesLoading && properties?.length > 0 && (
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

              {/* Empty state */}
              {!isPropertiesLoading && properties.length === 0 && (
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
          </TabsContent>

          <TabsContent value="expenses" activeValue={activeTab}>
            <ExpensesTab searchTerm={searchTerm} portfolioId={id} />
          </TabsContent>

          <TabsContent value="maintenance" activeValue={activeTab}>
            <MaintenanceTab searchTerm={searchTerm} portfolioId={id} />
          </TabsContent>

          {/* Modals */}
          <AddExpenseModal
            isOpen={isExpenseModalOpen}
            onClose={() => setIsExpenseModalOpen(false)}
            portfolioId={id}
          />
          <AddTicketModal
            isOpen={isTicketModalOpen}
            onClose={() => setIsTicketModalOpen(false)}
            portfolioId={id}
          />
        </div>

        {/* Pagination - fixed at bottom */}
        <div className="mt-auto pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
}
