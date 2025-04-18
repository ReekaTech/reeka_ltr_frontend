'use client';

import { ArrowLeft, LayoutGrid, List, Search } from 'lucide-react';
import { ExpensesTab, MaintenanceTab, PropertiesTab } from './tabs';
import { Tabs, TabsContent } from '@/components/ui';
import { useEffect, useState } from 'react';

import { AddExpenseModal } from './add-expense-modal';
import { AddTicketModal } from './add-ticket-modal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Sample portfolio data
const portfolios = {
  yinka: {
    id: 'yinka',
    name: 'Yinka Portfolio',
    createdDate: '25th August 2025',
    propertyCount: 25,
  },
  bimbo: {
    id: 'bimbo',
    name: 'Bimbo Portfolio',
    createdDate: '15th July 2025',
    propertyCount: 21,
  },
};

interface PortfolioDetailProps {
  portfolioId: string;
}

export function PortfolioDetail({ portfolioId }: PortfolioDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('properties');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the portfolio data from an API
    setPortfolio(portfolios[portfolioId as keyof typeof portfolios]);
  }, [portfolioId]);

  const handleGoBack = () => {
    router.back();
  };

  if (!portfolio) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
      </div>
    );
  }

  const tabs = [
    { label: 'Properties', value: 'properties' },
    { label: 'Expenses', value: 'expenses' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
        </button>
      </div>

      {/* Portfolio header */}
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{portfolio.name}</h1>
          <p className="text-gray-500">Created on {portfolio.createdDate}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        items={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
        rightSlot={
          <div className="text-sm text-gray-500">
            {portfolio.propertyCount} Properties
          </div>
        }
      />

      {/* Search and actions */}
      <div className="mt-6 mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle (only show for Properties tab) */}
          {activeTab === 'properties' && (
            <div className="flex items-center overflow-hidden rounded-md border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400'
                }`}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-white text-gray-400'
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Add Property to Portfolio button (only show for Properties tab) */}
          {activeTab === 'properties' && (
            <Link
              href="/listings/add-property"
              className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
            >
              Add Property to Portfolio
            </Link>
          )}

          {/* Add Expense button (only show for Expenses tab) */}
          {activeTab === 'expenses' && (
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
            >
              Add Expense to Portfolio
            </button>
          )}

          {/* Add Ticket button (only show for Maintenance tab) */}
          {activeTab === 'maintenance' && (
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
            >
              Add Ticket
            </button>
          )}
        </div>
      </div>

      {/* Tab content */}
      <TabsContent value="properties" activeValue={activeTab}>
        <PropertiesTab searchTerm={searchTerm} viewMode={viewMode} />
      </TabsContent>
      <TabsContent value="expenses" activeValue={activeTab}>
        <ExpensesTab searchTerm={searchTerm} />
      </TabsContent>
      <TabsContent value="maintenance" activeValue={activeTab}>
        <MaintenanceTab searchTerm={searchTerm} />
      </TabsContent>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        portfolioId={portfolioId}
        portfolioName={portfolio.name}
      />

      {/* Add Ticket Modal */}
      <AddTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        portfolioId={portfolioId}
        portfolioName={portfolio.name}
      />
    </div>
  );
}
