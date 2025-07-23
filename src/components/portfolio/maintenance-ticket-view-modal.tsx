'use client';

import { Edit, X } from 'lucide-react';

import { Modal } from '@/components/ui';

interface MaintenanceTicketViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  ticket?: {
    id: string;
    description: string;
    dateOfCreation: string;
    requestType: string;
    status: string;
    ticketNumber?: string;
    title?: string;
    priority?: string;
    attachments?: string[];
    property?: {
      name: string;
    };
    portfolio?: {
      name: string;
    };
  };
}

export function MaintenanceTicketViewModal({
  isOpen,
  onClose,
  onEdit,
  ticket,
}: MaintenanceTicketViewModalProps) {
  if (!ticket) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      contentClassName="p-0 max-w-4xl"
    >
      <div className="relative rounded-lg bg-white p-6">
        {/* Header with Close and Edit buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Maintenance Ticket #{ticket.ticketNumber}
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
            <button
              className="text-gray-400 hover:text-gray-500 p-1"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Title Section */}
        {ticket.title && (
          <div className="mb-6 rounded-2xl border border-gray-100 p-6">
            <h3 className="mb-2 text-base font-medium text-gray-500">
              Title
            </h3>
            <p className="text-lg font-semibold text-gray-900">
              {ticket.title}
            </p>
          </div>
        )}

        {/* Maintenance Description Card */}
        <div className="mb-6 rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-2 text-base font-medium text-gray-500">
            Maintenance Description
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">
            {ticket.description ||
              'No description provided.'}
          </p>
        </div>

        {/* Details Card */}
        <div className="mb-6 rounded-2xl border border-gray-100 p-6">
          <h3 className="mb-4 text-base font-medium text-gray-500">
            Ticket Details
          </h3>
          <div className="grid grid-cols-2 gap-y-6 md:grid-cols-3">
            {/* Ticket ID */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">Ticket Number</h4>
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

            {/* Priority */}
            {ticket.priority && (
              <div className="col-span-1">
                <h4 className="text-sm font-normal text-gray-500">
                  Priority
                </h4>
                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                  {ticket.priority}
                </p>
              </div>
            )}

            {/* Date of Creation */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">
                Date of Creation
              </h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {ticket.dateOfCreation}
              </p>
            </div>

            {/* Property */}
            {ticket.property && (
              <div className="col-span-1">
                <h4 className="text-sm font-normal text-gray-500">Property</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {ticket.property.name}
                </p>
              </div>
            )}

            {/* Portfolio */}
            {ticket.portfolio && (
              <div className="col-span-1">
                <h4 className="text-sm font-normal text-gray-500">Portfolio</h4>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {ticket.portfolio.name}
                </p>
              </div>
            )}

            {/* Status */}
            <div className="col-span-1">
              <h4 className="text-sm font-normal text-gray-500">Status</h4>
              <div className="mt-1">
                <StatusBadge status={ticket.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Attachments Section */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="rounded-2xl border border-gray-100 p-6">
            <h3 className="mb-4 text-base font-medium text-gray-500">
              Attachments ({ticket.attachments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ticket.attachments.map((attachment, index) => {
                const fileName = attachment.split('/').pop() || `attachment-${index + 1}`;
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                
                return (
                  <div
                    key={index}
                    className="group rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                        {isImage ? (
                          <img
                            src={attachment}
                            alt={fileName}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <svg
                            className="h-8 w-8 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileName}
                        </p>
                        <a
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#e36b37] hover:underline"
                        >
                          View file
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = '';

  switch (status.toLowerCase()) {
    case 'completed':
      color = 'text-green-600 bg-green-50';
      break;
    case 'open':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'in_progress':
      color = 'text-orange-600 bg-orange-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  const displayStatus = status === 'in_progress' ? 'In Progress' : 
                       status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium ${color}`}
    >
      {displayStatus}
    </span>
  );
}
