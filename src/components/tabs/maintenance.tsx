'use client';

import { Eye, MoreVertical } from 'lucide-react';

import { AddTicketModal } from '@/components/portfolio/add-ticket-modal';
import { MaintenanceTicket } from '@/services/api/schemas';
import { MaintenanceTicketViewModal } from '@/components/portfolio';
import { Pagination } from '@/components/ui';
import { format } from 'date-fns';
import { useMaintenanceTickets } from '@/services/queries/hooks';
import { useState } from 'react';

interface MaintenanceTabProps {
  propertyId?: string;
  portfolioId?: string;
  searchTerm: string;
}

export function MaintenanceTab({ propertyId, portfolioId, searchTerm }: MaintenanceTabProps) {
  const [page, setPage] = useState(1);
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const limit = 10;

  const { data: ticketsData, isLoading } = useMaintenanceTickets({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    propertyId,
    portfolioId,
    search: searchTerm,
  });

  // Filter tickets based on search term
  const filteredTickets = ticketsData?.items.filter((ticket: MaintenanceTicket) => 
    ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.type.toLowerCase().includes(searchTerm.toLowerCase())
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
                <div className="grid grid-cols-5 gap-4 rounded-t-lg bg-[#f6f6f6] px-4 py-3">
                  <div className="text-left text-sm font-medium text-gray-500">Ticket Number</div>
                  <div className="text-left text-sm font-medium text-gray-500">Description</div>
                  <div className="text-left text-sm font-medium text-gray-500">Date of Creation</div>
                  <div className="text-left text-sm font-medium text-gray-500">Type</div>
                  <div className="text-left text-sm font-medium text-gray-500">Status</div>
                </div>

                {/* Loading rows */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="grid grid-cols-5 gap-4 px-4 py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
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
  if (!ticketsData?.items || filteredTickets.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No maintenance tickets found matching "${searchTerm}". Try a different search term.`
            : 'No maintenance tickets found for this portfolio.'}
        </p>
        <button 
          onClick={() => setIsAddTicketModalOpen(true)}
          className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all cursor-pointer"
        >
          Add Ticket
        </button>
        <AddTicketModal
          isOpen={isAddTicketModalOpen}
          onClose={() => setIsAddTicketModalOpen(false)}
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
              <div className="grid grid-cols-5 gap-4 rounded-t-lg bg-[#f6f6f6] px-4 py-3">
                <div className="text-left text-sm font-medium text-gray-500">Ticket Number</div>
                <div className="text-left text-sm font-medium text-gray-500">Description</div>
                <div className="text-left text-sm font-medium text-gray-500">Date of Creation</div>
                <div className="text-left text-sm font-medium text-gray-500">Type</div>
                <div className="text-left text-sm font-medium text-gray-500">Status</div>
              </div>

              {/* Body */}
              <div className="divide-y divide-gray-200 bg-white">
                {filteredTickets.map((ticket: MaintenanceTicket) => (
                  <div 
                    key={ticket._id} 
                    className="grid grid-cols-5 gap-4 px-4 py-4 hover:bg-gray-50"
                  >
                    <div 
                      className="text-sm font-medium text-gray-900 cursor-pointer hover:text-[#e36b37]"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setIsViewModalOpen(true);
                      }}
                    >
                      #{ticket.ticketNumber}
                    </div>
                    <div className="text-sm text-gray-500">{ticket.description}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(ticket.createdAt), 'MMMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">{ticket.type}</div>
                    <div className="text-sm">
                      <StatusBadge status={ticket.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Ticket Modal */}
        <AddTicketModal
          isOpen={isAddTicketModalOpen}
          onClose={() => setIsAddTicketModalOpen(false)}
          portfolioId={portfolioId || ''}
          propertyId={propertyId || ''}
        />

        {/* View Ticket Modal */}
        <MaintenanceTicketViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          ticket={selectedTicket ? {
            id: selectedTicket._id,
            description: selectedTicket.description,
            dateOfCreation: selectedTicket.createdAt,
            requestType: selectedTicket.type,
            status: selectedTicket.status,
            ticketNumber: selectedTicket.ticketNumber
          } : undefined}
        />
      </div>

      {/* Pagination - always at the bottom */}
      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={ticketsData?.pages || 1}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = '';

  switch (status.toLowerCase()) {
    case 'open':
      color = 'text-yellow-600 bg-yellow-50';
      break;
    case 'in_progress':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'completed':
      color = 'text-green-600 bg-green-50';
      break;
    case 'cancelled':
      color = 'text-red-600 bg-red-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
