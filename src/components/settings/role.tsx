'use client';

import { MoreVertical, Search } from 'lucide-react';
import {
  useDebounce,
  useRetryInvite,
  useUsers,
} from '@/services/queries/hooks';
import { useEffect, useRef, useState } from 'react';

import { AddStaffForm } from './add-staff-form';
import { Pagination } from '@/components/ui';
import { formatDate } from '@/lib/utils';

export function RolesForm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [emailFilter, setEmailFilter] = useState<string>('');
  const ITEMS_PER_PAGE = 10;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: retryInvitation, isPending: isRetrying } = useRetryInvite();

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Extract filters from search term
  useEffect(() => {
    if (debouncedSearch) {
      const emailRegex = /\S+@\S+\.\S+/;

      if (emailRegex.test(debouncedSearch)) {
        setEmailFilter(debouncedSearch);
        setNameFilter('');
      } else {
        setNameFilter(debouncedSearch);
        setEmailFilter('');
      }
    } else {
      setNameFilter('');
      setEmailFilter('');
    }
  }, [debouncedSearch]);

  // Fetch users with pagination and filtering
  const {
    data: usersData,
    isLoading,
    isError,
  } = useUsers({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    firstName: nameFilter,
    email: emailFilter,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (showAddStaffForm) {
    return <AddStaffForm onBack={() => setShowAddStaffForm(false)} />;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="relative w-full sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Staff (by name or email)"
            className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
          onClick={() => setShowAddStaffForm(true)}
        >
          Add Staff
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="rounded-t-lg bg-[#f6f6f6]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 first:rounded-tl-lg">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Date Added
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Phone No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  Invitation Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 last:rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e36b37] border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    Error loading users. Please try again.
                  </td>
                </tr>
              ) : usersData?.items && usersData.items.length > 0 ? (
                usersData.items.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                      {user.phoneCountryCode}
                      {user.phone}
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      <StatusBadge status={user.invitationStatus || 'OWNER'} />
                    </td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap">
                      {user.invitationStatus === 'EXPIRED' && (
                        <div className="relative">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === user.id ? null : user.id,
                              );
                            }}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenuId === user.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                            >
                              <button
                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                disabled={isRetrying}
                                onClick={() => {
                                  retryInvitation(user.id, {
                                    onSuccess: () => {
                                      setOpenMenuId(null);
                                    },
                                  });
                                }}
                              >
                                {isRetrying ? 'Retrying...' : 'Retry'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No staff members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {usersData && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={usersData.pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  let color = '';

  switch (role) {
    case 'Property Manager':
      color = 'text-purple-600 bg-purple-50';
      break;
    case 'Building and Maintenance':
      color = 'text-yellow-600 bg-yellow-50';
      break;
    case 'Administrator':
    case 'Admin':
      color = 'text-[#e36b37] bg-orange-50';
      break;
    case 'Owner':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'Tenant':
      color = 'text-green-600 bg-green-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = '';

  switch (status) {
    case 'ACCEPTED':
      color = 'text-green-600 bg-green-50';
      break;
    case 'PENDING':
      color = 'text-yellow-600 bg-yellow-50';
      break;
    case 'EXPIRED':
      color = 'text-red-600 bg-red-50';
      break;
    case 'REJECTED':
      color = 'text-red-600 bg-red-50';
      break;
    case 'OWNER':
      color = 'text-blue-600 bg-blue-50';
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
