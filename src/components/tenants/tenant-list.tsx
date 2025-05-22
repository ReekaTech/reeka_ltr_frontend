'use client';

import type { Lease, Portfolio } from '@/services/api/schemas';
import { MoreVertical, Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTenantsQuery, useUpdatePaymentStatusMutation } from '@/services/queries/hooks/useTenants';

import { Pagination } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { useDebounce } from '@/services/queries/hooks';

export function TenantList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('all');
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [portfolioSearch, setPortfolioSearch] = useState('');
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchTerm, 500);
  const debouncedPortfolioSearch = useDebounce(portfolioSearch, 300);





  // Fetch tenants with filters
  const {
    data: tenantsData,
    isLoading,
    isError,
  } = useTenantsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: 'startDate',
    sortOrder: 'desc',
    search: debouncedSearch,
    portfolioId: selectedPortfolio === 'all' ? undefined : selectedPortfolio,
  });


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  

  return (
    <div className="relative">
      <div className="rounded-lg bg-white p-4">
        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-start sm:space-y-0">
          <div className="flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:w-[80%] md:w-[70%] lg:w-[50%]">
            {/* Portfolio Filter Dropdown */}
           

            {/* Search Input */}
            <div className="relative w-full sm:w-1/2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tenants"
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 focus:border-[#e36b37] focus:ring-[#e36b37] focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <div className="w-full">
            {/* Header */}
            <div className="grid grid-cols-6 bg-[#f6f6f6] rounded-t-lg">
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</div>
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Start Date</div>
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">End Date</div>
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Current Rate</div>
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment Frequency</div>
              <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Payment Status</div>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                // Skeleton Loading State
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-6 animate-pulse">
                    <div className="px-4 py-4">
                      <div className="h-4 w-32 rounded bg-gray-200"></div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200"></div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="h-4 w-24 rounded bg-gray-200"></div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="h-4 w-20 rounded bg-gray-200"></div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="h-4 w-28 rounded bg-gray-200"></div>
                    </div>
                    <div className="px-4 py-4">
                      <div className="h-5 w-16 rounded-full bg-gray-200"></div>
                    </div>
                  </div>
                ))
              ) : tenantsData?.items && tenantsData.items.length > 0 ? (
                tenantsData.items.map((lease: Lease) => (
                  <div key={lease._id} className="grid grid-cols-6 hover:bg-gray-50">
                    <div className="px-4 py-4 text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      <a href="#" className="text-[#e36b37] hover:underline">
                        {lease.tenant?.firstName} {lease.tenant?.lastName}
                      </a>
                    </div>
                    <div className="px-4 py-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-500">
                      {formatDate(lease.startDate)}
                    </div>
                    <div className="px-4 py-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-500">
                      {formatDate(lease.endDate)}
                    </div>
                    <div className="px-4 py-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-500">
                      ₦{lease.rentalRate.toLocaleString()}
                    </div>
                    <div className="px-4 py-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-500">
                      {lease.paymentFrequency}
                    </div>
                    <div className="px-4 py-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      <StatusBadge status={lease.paymentStatus || 'unpaid'} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No tenants found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {tenantsData && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={tenantsData.pages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'paid' | 'unpaid' }) {
  const color = status === 'paid'
    ? 'text-green-600 bg-green-50'
    : 'text-red-600 bg-red-50';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
} 