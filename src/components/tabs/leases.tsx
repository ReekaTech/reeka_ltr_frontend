'use client';

import { Badge, Tabs, TabsContent } from "@/components/ui";
import { Plus, Search } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useCancelLease, useLeases } from "@/services/queries/hooks";
import { useEffect, useState } from "react";

import { AddLeaseModal } from "@/components/portfolio/add-lease-modal";
import { Lease } from "@/services/api/schemas";
import { UpdateLeaseModal } from "@/components/portfolio/update-lease-modal";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";

interface LeasesTabProps {
  propertyId?: string;
  searchTerm: string;
}

type LeaseStatus = 'active' | 'completed' | 'all';

export function LeasesTab({ propertyId, searchTerm }: LeasesTabProps) {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<LeaseStatus>('all');
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
  const [isUpdateLeaseModalOpen, setIsUpdateLeaseModalOpen] = useState(false);
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null);
  const limit = 10;

  const cancelLeaseMutation = useCancelLease();

  // Debounce search term


  // Fetch leases based on active tab and search
  const { data: leasesData, isLoading } = useLeases({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    propertyId,
    search: searchTerm,
    status: activeTab === 'all' ? undefined : activeTab,
  });

  const leases = leasesData?.items || [];

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'completed' },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value as LeaseStatus);
    setPage(1); // Reset to first page when changing tabs
  };

  const handleEditLease = (lease: Lease) => {
    setSelectedLease(lease);
    setIsUpdateLeaseModalOpen(true);
  };


  const handleAddModalClose = () => {
    setIsAddLeaseModalOpen(false);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateLeaseModalOpen(false);
    setSelectedLease(null);
  };

  const handleCancelLease = async (leaseId: string) => {
    try {
      await cancelLeaseMutation.mutateAsync({
        id: leaseId,
        data: { reasonForTermination: 'Cancelled by user' }
      });
      toast.success('Lease cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel lease:', error);
    }
  };

  // LeaseActions component to match the property page pattern
  const LeaseActions = ({ lease }: { lease: Lease }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => handleEditLease(lease)}
        className="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 whitespace-nowrap"
      >
        Edit Lease
      </button>
      <button
        onClick={() => handleCancelLease(lease._id)}
        disabled={lease.status === 'terminated' || lease.status === 'expired' || !lease.isActive}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap",
          lease.status === 'terminated' || lease.status === 'expired' || !lease.isActive
            ? "text-gray-400 bg-gray-200 cursor-not-allowed"
            : "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
        )}
      >
        Cancel Lease
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs
        items={tabs}
        value={activeTab}
        onValueChange={handleTabChange}
      />

      {/* All Leases Tab Content */}
      <TabsContent value="all" activeValue={activeTab}>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 border-[#e36b37] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Leases Table */}
        <div className="space-y-4">
          {!isLoading && leases.length === 0 ? (
            <>
              <div className="overflow-x-auto">
                <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                  <span className="w-[100px]">Date</span>
                  <span className="w-[100px]">Apartment</span>
                  <span className="w-[100px]">Amount Paid</span>
                  <span className="w-[100px]">Status</span>
                  <span className="w-[200px]">Actions</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-8 text-center text-gray-500">
                {searchTerm
                  ? `No leases found matching "${searchTerm}". Try a different search term.`
                  : 'No leases found'}
              </div>
            </>
          ) : (
            !isLoading && leases.map((lease, index) => (
              <div key={index} className="space-y-1">
                <div className="overflow-x-auto">
                  <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                    <span className="w-[100px]">Date</span>
                    <span className="w-[100px]">Apartment</span>
                    <span className="w-[100px]">Amount Paid</span>
                    <span className="w-[100px]">Status</span>
                    <span className="w-[200px]">Actions</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between min-w-[600px]">
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(lease.startDate), 'MMM d')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(lease.startDate), 'h:mm a')}
                      </p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">{lease.property?.name || 'Unknown Property'}</p>
                      <p className="text-xs text-gray-500">{lease.property?.address || 'No address'}</p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">₦{lease.rentalRate}</p>
                      <p className="text-xs text-gray-500">For {lease.paymentFrequency || 'monthly'}</p>
                    </div>
                    <div className="w-[100px]">
                      <Badge
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-full",
                          lease.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {lease.status}
                      </Badge>
                    </div>
                    <div className="w-[200px]">
                      <LeaseActions lease={lease} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* Active Leases Tab Content */}
      <TabsContent value="active" activeValue={activeTab}>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 border-[#e36b37] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Leases Table */}
        <div className="space-y-4">
          {!isLoading && leases.length === 0 ? (
            <>
              <div className="overflow-x-auto">
                <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                  <span className="w-[100px]">Date</span>
                  <span className="w-[100px]">Apartment</span>
                  <span className="w-[100px]">Amount Paid</span>
                  <span className="w-[100px]">Status</span>
                  <span className="w-[200px]">Actions</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-8 text-center text-gray-500">
                {searchTerm
                  ? `No active leases found matching "${searchTerm}". Try a different search term.`
                  : 'No active leases found'}
              </div>
            </>
          ) : (
            !isLoading && leases.map((lease, index) => (
              <div key={index} className="space-y-1">
                <div className="overflow-x-auto">
                  <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                    <span className="w-[100px]">Date</span>
                    <span className="w-[100px]">Apartment</span>
                    <span className="w-[100px]">Amount Paid</span>
                    <span className="w-[100px]">Status</span>
                    <span className="w-[200px]">Actions</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between min-w-[600px]">
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(lease.startDate), 'MMM d')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(lease.startDate), 'h:mm a')}
                      </p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">{lease.property?.name || 'Unknown Property'}</p>
                      <p className="text-xs text-gray-500">{lease.property?.address || 'No address'}</p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">₦{lease.rentalRate}</p>
                      <p className="text-xs text-gray-500">For {lease.paymentFrequency || 'monthly'}</p>
                    </div>
                    <div className="w-[100px]">
                      <Badge
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-full",
                          lease.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {lease.status}
                      </Badge>
                    </div>
                    <div className="w-[200px]">
                      <LeaseActions lease={lease} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* Inactive Leases Tab Content */}
      <TabsContent value="completed" activeValue={activeTab}>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 border-[#e36b37] rounded-full animate-spin"></div>
          </div>
        )}

        {/* Leases Table */}
        <div className="space-y-4">
          {!isLoading && leases.length === 0 ? (
            <>
              <div className="overflow-x-auto">
                <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                  <span className="w-[100px]">Date</span>
                  <span className="w-[100px]">Apartment</span>
                  <span className="w-[100px]">Amount Paid</span>
                  <span className="w-[100px]">Status</span>
                  <span className="w-[200px]">Actions</span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-8 text-center text-gray-500">
                {searchTerm
                  ? `No inactive leases found matching "${searchTerm}". Try a different search term.`
                  : 'No inactive leases found'}
              </div>
            </>
          ) : (
            !isLoading && leases.map((lease, index) => (
              <div key={index} className="space-y-1">
                <div className="overflow-x-auto">
                  <div className="flex justify-between px-4 py-4 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[600px]">
                    <span className="w-[100px]">Date</span>
                    <span className="w-[100px]">Apartment</span>
                    <span className="w-[100px]">Amount Paid</span>
                    <span className="w-[100px]">Status</span>
                    <span className="w-[200px]">Actions</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between min-w-[600px]">
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">
                        {format(parseISO(lease.startDate), 'MMM d')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(parseISO(lease.startDate), 'h:mm a')}
                      </p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">{lease.property?.name || 'Unknown Property'}</p>
                      <p className="text-xs text-gray-500">{lease.property?.address || 'No address'}</p>
                    </div>
                    <div className="w-[100px]">
                      <p className="text-sm font-medium text-gray-900">₦{lease.rentalRate}</p>
                      <p className="text-xs text-gray-500">For {lease.paymentFrequency || 'monthly'}</p>
                    </div>
                    <div className="w-[100px]">
                      <Badge
                        className={cn(
                          "text-xs font-medium px-3 py-1 rounded-full",
                          lease.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        )}
                      >
                        {lease.status}
                      </Badge>
                    </div>
                    <div className="w-[200px]">
                      <LeaseActions lease={lease} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* Add Lease Modal */}
      {propertyId && (
        <AddLeaseModal
          isOpen={isAddLeaseModalOpen}
          onClose={handleAddModalClose}
          propertyId={propertyId}
          propertyName="Property" // You might want to pass the actual property name
        />
      )}

      {/* Update Lease Modal */}
      {selectedLease && (
        <UpdateLeaseModal
          isOpen={isUpdateLeaseModalOpen}
          onClose={handleUpdateModalClose}
          lease={selectedLease}
        />
      )}
    </div>
  );
}