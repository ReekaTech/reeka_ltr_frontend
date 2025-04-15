import { ChevronLeft, ChevronRight } from 'lucide-react';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range of pages to show around current page
    let rangeStart = Math.max(2, currentPage - 1);
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Adjust range if at start or end
    if (currentPage <= 2) {
      rangeEnd = Math.min(4, totalPages - 1);
    } else if (currentPage >= totalPages - 1) {
      rangeStart = Math.max(2, totalPages - 3);
    }

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pages.push('ellipsis-start');
    }

    // Add pages in range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span
              key={`${page}-${index}`}
              className="flex h-9 w-9 items-center justify-center text-gray-500"
            >
              …
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors ${
              isActive
                ? 'bg-[#e36b37] font-medium text-white'
                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
