import { Eye, MoreVertical } from 'lucide-react';

import { MaintenanceTicketViewModal } from '../maintenance-ticket-view-modal';
import { useState } from 'react';

interface MaintenanceTabProps {
  searchTerm: string;
}

// Sample maintenance tickets data
const maintenanceTickets = [
  {
    id: '2900',
    description: 'Light Fixing',
    property: 'Ama Nest',
    dateOfCreation: '24-1-2026',
    requestType: 'Light',
    status: 'Complete',
  },
  {
    id: '2901',
    description: 'Water running fixture',
    property: 'Waterfield Estate',
    dateOfCreation: '24-1-2026',
    requestType: 'Water',
    status: 'Open',
  },
  {
    id: '2903',
    description: 'Cleaning',
    property: 'Ama Nest',
    dateOfCreation: '24-1-2026',
    requestType: 'Cleaning',
    status: 'In Progress',
  },
  {
    id: '2904',
    description: 'Microwave needs fixing',
    property: 'Bancroft Hosing',
    dateOfCreation: '24-1-2026',
    requestType: 'Appliances',
    status: 'Complete',
  },
  {
    id: '2905',
    description: 'Weeding of the frontyard',
    property: 'Waterfield Estate',
    dateOfCreation: '24-1-2026',
    requestType: 'Gardening',
    status: 'Open',
  },
  {
    id: '2906',
    description: 'AC needs fixing',
    property: 'Zest Housing',
    dateOfCreation: '24-1-2026',
    requestType: 'Appliances',
    status: 'Open',
  },
  {
    id: '2907',
    description: 'The TV screen is broken',
    property: 'Zest Housing',
    dateOfCreation: '24-1-2026',
    requestType: 'Appliances',
    status: 'Complete',
  },
  {
    id: '2908',
    description: 'The apartment needs cleaning',
    property: 'Bancroft Hosing',
    dateOfCreation: '24-1-2026',
    requestType: 'Cleaning',
    status: 'Complete',
  },
  {
    id: '2909',
    description: 'There is no water in the bathroom',
    property: 'Ama Nest',
    dateOfCreation: '24-1-2026',
    requestType: 'Water',
    status: 'In Progress',
  },
  {
    id: '2910',
    description: 'My Bedroom needs cleaning',
    property: 'Bancroft Hosing',
    dateOfCreation: '24-1-2026',
    requestType: 'Cleaning',
    status: 'In Progress',
  },
];

export function MaintenanceTab({ searchTerm }: MaintenanceTabProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<
    (typeof maintenanceTickets)[0] | null
  >(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Toggle dropdown for a specific ticket
  const toggleDropdown = (ticketId: string) => {
    if (activeDropdown === ticketId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(ticketId);
    }
  };

  // Handle view action
  const handleView = (ticketId: string) => {
    const ticket = maintenanceTickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticket);
      setIsViewModalOpen(true);
    }
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  // Filter maintenance tickets based on search term
  const filteredTickets = maintenanceTickets.filter(
    ticket =>
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.includes(searchTerm),
  );

  // Empty state
  if (filteredTickets.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No maintenance tickets found matching "${searchTerm}". Try a different search term.`
            : 'No maintenance tickets found for this portfolio.'}
        </p>
        <button className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all">
          Add Ticket
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {activeDropdown && (
          <div className="fixed inset-0 z-10" onClick={handleClickOutside} />
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="rounded-t-lg bg-[#f6f6f6]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 first:rounded-tl-lg">
                Ticket Number
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Property
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Date of Creation
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Request Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 last:rounded-tr-lg">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  #{ticket.id}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                  {ticket.description}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                  {ticket.property}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                  {ticket.dateOfCreation}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                  {ticket.requestType}
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-4 text-right text-sm whitespace-nowrap">
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => toggleDropdown(ticket.id)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {activeDropdown === ticket.id && (
                      <div className="absolute right-0 z-20 mt-2 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => handleView(ticket.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Ticket Modal */}
      <MaintenanceTicketViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        ticket={selectedTicket || undefined}
      />
    </>
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
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
}
