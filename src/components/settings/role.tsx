'use client';

import { MoreVertical, Search } from 'lucide-react';
import { Pagination, PromptModal } from '@/components/ui';
import {
  useDebounce,
  useRemoveUser,
  useRetryInvite,
  useUsers,
} from '@/services/queries/hooks';
import { useEffect, useRef, useState } from 'react';

import { AddStaffForm } from './add-staff-form';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-toastify';

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
  const { mutate: removeUser, isPending: isRemoving } = useRemoveUser();

  // State for prompt modal
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptData, setPromptData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    userId: string;
    userName: string;
  } | null>(null);

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
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="grid grid-cols-6 bg-[#f6f6f6] rounded-t-lg">
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</div>
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date Added</div>
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</div>
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone No</div>
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Invitation Status</div>
            <div className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</div>
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
                    <div className="h-5 w-28 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="h-4 w-28 rounded bg-gray-200"></div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="h-5 w-20 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="h-4 w-8 rounded bg-gray-200"></div>
                  </div>
                    </div>
              ))
              ) : usersData?.items && usersData.items.length > 0 ? (
                usersData.items.map(user => (
                <div key={user.id} className="grid grid-cols-6 hover:bg-gray-50">
                  <div className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {user.firstName} {user.lastName}
                  </div>
                  <div className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                      {formatDate(user.createdAt)}
                  </div>
                  <div className="px-4 py-4 text-sm whitespace-nowrap">
                      <RoleBadge role={user.role} />
                  </div>
                  <div className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                      {user.phoneCountryCode}
                      {user.phone}
                  </div>
                  <div className="px-4 py-4 text-sm whitespace-nowrap">
                      <StatusBadge status={user?.invitationStatus || user.role === 'Owner' ? 'OWNER' : 'ACCEPTED'} />
                  </div>
                  <div className="px-4 py-4 text-sm whitespace-nowrap">
                      <div className="relative">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={e => {
                            e.stopPropagation();
                          setOpenMenuId(openMenuId === user.id ? null : user.id);
                          }}
                        >
                          <MoreVertical className="h-4 w-4 cursor-pointer" />
                        </button>
                        {openMenuId === user.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                          >
                            {user.invitationStatus === 'EXPIRED' && (
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
                            )}
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              disabled={isRemoving}
                              onClick={() => {
                                setOpenMenuId(null);
                                setPromptData({
                                  title: 'Confirm Removal',
                                  message: `Are you sure you want to remove ${user.firstName} ${user.lastName}? This action cannot be undone.`,
                                  userId: user.id,
                                  userName: `${user.firstName} ${user.lastName}`,
                                  onConfirm: () => {
                                    removeUser(user.id, {
                                      onSuccess: () => {
                                        toast.success(
                                          `${user.firstName} ${user.lastName} has been removed`,
                                        );
                                        setShowPromptModal(false);
                                      },
                                      onError: () => {
                                        setShowPromptModal(false);
                                      },
                                    });
                                  },
                                });
                                setShowPromptModal(true);
                              }}
                            >
                              {isRemoving && promptData?.userId === user.id
                                ? 'Removing...'
                                : 'Remove'}
                            </button>
                          </div>
                        )}
                      </div>
                  </div>
                </div>
                ))
              ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500">No staff members found</p>
              </div>
              )}
          </div>
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

      {/* Prompt Modal */}
      {promptData && (
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          onConfirm={promptData.onConfirm}
          title={promptData.title}
          message={promptData.message}
          confirmText="Remove"
          cancelText="Cancel"
          isProcessing={isRemoving}
        />
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
