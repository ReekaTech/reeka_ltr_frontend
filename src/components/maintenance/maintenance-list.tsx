'use client';

import { Eye, MoreVertical, Pencil, Search } from 'lucide-react';
import type { MaintenanceStatus, MaintenanceTicket } from '@/services/api/schemas/maintenance';
import { useEffect, useRef, useState } from 'react';
import { useMaintenanceQuery, useUpdateMaintenanceStatusMutation } from '@/services/queries/hooks/useMaintenance';

import { EditMaintenanceTicketModal } from '@/components/maintenance/edit-maintenance-ticket-modal';
import { MaintenanceTicketViewModal } from '@/components/portfolio/maintenance-ticket-view-modal';
import { Pagination } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-toastify';
import { useDebounce } from '@/services/queries/hooks';

export function MaintenanceList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showPortfolioDropdown, setShowPortfolioDropdown] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portfolioDropdownRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 10;

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Fetch maintenance tickets with filters
  const {
    data: maintenanceData,
    isLoading,
    isError,
  } = useMaintenanceQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: debouncedSearch,
  });

  const { mutate: updateStatus } = useUpdateMaintenanceStatusMutation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Close portfolio dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (portfolioDropdownRef.current && !portfolioDropdownRef.current.contains(event.target as Node)) {
        setShowPortfolioDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [portfolioDropdownRef]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (ticketId: string, status: MaintenanceStatus) => {
    updateStatus({ ticketId, status });
    setOpenMenuId(null);
  };

  const handleViewTicket = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
    setOpenMenuId(null);
  };

  const handleEditTicket = (ticket: MaintenanceTicket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  if (isError) {
    toast.error('Error loading maintenance tickets. Please try again.');
  }

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex w-full flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 sm:w-[80%] md:w-[70%] lg:w-[50%]">

          {/* Search Input */}
          <div className="relative w-full sm:w-1/2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search maintenance tickets"
              className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 focus:border-[#e36b37] focus:ring-[#e36b37] focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-[1400px] w-full">
          {/* Header */}
          <div className="grid grid-cols-8 gap-4 bg-[#f6f6f6] rounded-t-lg px-4 py-3">
            <div className="text-left text-sm font-medium text-gray-500">Ticket No</div>
            <div className="text-left text-sm font-medium text-gray-500">Description</div>
            <div className="text-left text-sm font-medium text-gray-500">Property</div>
            <div className="text-left text-sm font-medium text-gray-500">Portfolio</div>
            <div className="text-left text-sm font-medium text-gray-500">Date of Creation</div>
            <div className="text-left text-sm font-medium text-gray-500">Request Type</div>
            <div className="text-left text-sm font-medium text-gray-500">Status</div>
            <div className="text-left text-sm font-medium text-gray-500">Actions</div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-200 bg-white">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid grid-cols-8 gap-4 px-4 py-4 animate-pulse">
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                  <div className="h-4 w-28 rounded bg-gray-200"></div>
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-4 w-28 rounded bg-gray-200"></div>
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                  <div className="h-5 w-20 rounded-full bg-gray-200"></div>
                  <div className="h-4 w-8 rounded bg-gray-200"></div>
                </div>
              ))
            ) : maintenanceData?.items && maintenanceData.items.length > 0 ? (
              maintenanceData.items.map((ticket: MaintenanceTicket) => (
                <div key={ticket._id} className="grid grid-cols-8 gap-4 px-4 py-4 hover:bg-gray-50">
                  <div className="text-sm font-medium">
                    <button 
                      onClick={() => handleViewTicket(ticket)}
                      className="text-[#e36b37] hover:underline truncate block cursor-pointer"
                    >
                      {ticket.ticketNumber}
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="truncate" title={ticket?.title || ticket?.description}>
                      {ticket?.title || ticket?.description}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="truncate" title={ticket.property?.name}>
                      {ticket.property?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="truncate" title={ticket.portfolio?.name}>
                      {ticket.portfolio?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="truncate" title={formatDate(ticket.createdAt)}>
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="truncate" title={ticket.category}>
                      {ticket.category}
                    </div>
                  </div>
                  <div className="text-sm">
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="text-sm">
                    <div className="relative">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === ticket._id ? null : ticket._id);
                        }}
                      >
                        <MoreVertical className="h-4 w-4 cursor-pointer" />
                      </button>
                      {openMenuId === ticket._id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                        >
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEditTicket(ticket)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Ticket
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleStatusChange(ticket._id, 'completed')}
                          >
                            Mark as Complete
                          </button>
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleStatusChange(ticket._id, 'in_progress')}
                          >
                            Mark as In Progress
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">No maintenance tickets found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {maintenanceData && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={maintenanceData.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <MaintenanceTicketViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket ? {
          id: selectedTicket._id,
          description: selectedTicket.description,
          dateOfCreation: formatDate(selectedTicket.createdAt),
          requestType: selectedTicket.category,
          status: selectedTicket.status,
          ticketNumber: selectedTicket.ticketNumber || '',
          title: selectedTicket.title,
          priority: selectedTicket.priority,
          attachments: selectedTicket.attachments,
          property: selectedTicket.property,
          portfolio: selectedTicket.portfolio
        } : undefined}
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
      />

      <EditMaintenanceTicketModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: MaintenanceStatus }) {
  let color = '';

  switch (status) {
    case 'completed':
      color = 'text-green-600 bg-green-50';
      break;
    case 'in_progress':
      color = 'text-orange-600 bg-orange-50';
      break;
    case 'open':
      color = 'text-blue-600 bg-blue-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  );
} 