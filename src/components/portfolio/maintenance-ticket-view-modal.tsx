'use client';

import { Modal } from '@/components/ui';
import { X } from 'lucide-react';

interface MaintenanceTicketViewModalProps {
  isOpen: boolean;
  onClose: () => void;

  ticket?: {
    id: string;
    description: string;
    dateOfCreation: string;
    requestType: string;
    status: string;
    ticketNumber?: string;
  };
}

export function MaintenanceTicketViewModal({
  isOpen,
  onClose,
  ticket,

}: MaintenanceTicketViewModalProps) {
  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      contentClassName="p-0 max-w-3xl"
    >
      <div className="relative rounded-lg bg-white">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Maintenance Description Card */}
        <div className="mb-5 rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 text-base font-medium text-gray-500">
            Maintenance Description
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {ticket.description ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
          </p>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3">
            {/* Ticket ID */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">Tickets</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                #{ticket.ticketNumber}
              </p>
            </div>

            

            {/* Request Type */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">
                Request Type
              </h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {ticket.requestType}
              </p>
            </div>

            {/* Date of Creation */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">
                Date of Creation
              </h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {ticket.dateOfCreation}
              </p>
            </div>

            {/* Status */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">Status</h4>
              <div className="mt-1">
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = '';

  switch (status) {
    case 'Complete':
      color = 'text-green-600 bg-green-50';
      break;
    case 'Open':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'In Progress':
      color = 'text-orange-600 bg-orange-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
