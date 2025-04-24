'use client';

import { AddExpenseModal } from '@/components/portfolio/add-expense-modal';
import { Pagination } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { useExpenses } from '@/services/queries/hooks/useExpense';
import { useState } from 'react';

interface ExpensesTabProps {
  propertyId?: string;
  portfolioId?: string;
  searchTerm: string;
}

export function ExpensesTab({ propertyId, portfolioId, searchTerm }: ExpensesTabProps) {
  const [page, setPage] = useState(1);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const limit = 10;

  const { data: expensesData, isLoading } = useExpenses({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    propertyId,
    portfolioId,
    search: searchTerm,
  });

  // Filter expenses based on search term
  const filteredExpenses = expensesData?.items.filter(expense => 
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-200px)]">
        <div className="flex-1">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[800px] rounded-lg border border-gray-200">
              <div className="min-w-full divide-y divide-gray-200">
                {/* Header */}
                <div className="grid grid-cols-4 gap-4 rounded-t-lg bg-[#f6f6f6] px-4 py-3">
                  <div className="text-left text-sm font-medium text-gray-500">Name</div>
                  <div className="text-left text-sm font-medium text-gray-500">Date</div>
                  <div className="text-left text-sm font-medium text-gray-500">Type</div>
                  <div className="text-left text-sm font-medium text-gray-500">Amount</div>
                </div>

                {/* Loading rows */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 px-4 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!expensesData?.items || filteredExpenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No expenses found matching "${searchTerm}". Try a different search term.`
            : 'No expenses found for this portfolio.'}
        </p>
        <button 
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all cursor-pointer"
        >
          Add Expense
        </button>
        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          portfolioId={portfolioId || ''}
          propertyId={propertyId || ''}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-200px)]">
      <div className="flex-1">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[800px] rounded-lg border border-gray-200">
            <div className="min-w-full divide-y divide-gray-200">
              {/* Header */}
              <div className="grid grid-cols-4 gap-4 rounded-t-lg bg-[#f6f6f6] px-4 py-3">
                <div className="text-left text-sm font-medium text-gray-500">Name</div>
                <div className="text-left text-sm font-medium text-gray-500">Date</div>
                <div className="text-left text-sm font-medium text-gray-500">Type</div>
                <div className="text-left text-sm font-medium text-gray-500">Amount</div>
              </div>

              {/* Body */}
              <div className="divide-y divide-gray-200 bg-white">
                {filteredExpenses.map(expense => (
                  <div key={expense._id} className="grid grid-cols-4 gap-4 px-4 py-4 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">{expense.name}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(expense.date), 'MMMM d, yyyy')}
                    </div>
                    <div className="text-sm">
                      <TypeBadge type={expense.category} />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₦{expense.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
          portfolioId={portfolioId || ''}
          propertyId={propertyId || ''}
        />
      </div>

      {/* Pagination - always at the bottom */}
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={expensesData?.pages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  let color = '';

  switch (type.toLowerCase()) {
    case 'maintenance':
      color = 'text-purple-600 bg-purple-50';
      break;
    case 'utilities':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'insurance':
      color = 'text-green-600 bg-green-50';
      break;
    case 'taxes':
      color = 'text-red-600 bg-red-50';
      break;
    case 'miscellaneous':
      color = 'text-orange-600 bg-orange-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
