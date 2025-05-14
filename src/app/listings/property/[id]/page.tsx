'use client';

import {
  ArrowLeft,
  MoreVertical,
  Search,
} from 'lucide-react';
import { ExpensesTab, MaintenanceTab } from '@/components/tabs';
import { ImageGallery, Layout, Tabs, TabsContent } from '@/components/ui';
import { format, parseISO } from 'date-fns';
import { use, useEffect, useRef, useState } from 'react';
import { useCancelLease, useLeases, useProperty, useRenewLease, useUpdateProperty } from '@/services/queries/hooks';

import { AddExpenseModal } from '@/components/portfolio/add-expense-modal';
import { AddLeaseModal } from '@/components/portfolio/add-lease-modal';
import { AddTicketModal } from '@/components/portfolio/add-ticket-modal';
import { Badge } from "@/components/ui/badge";
import { EditAmenitiesModal } from '@/components/property/edit-amenities-modal';
import { EditImagesModal } from '@/components/property/edit-images-modal';
import type { Lease } from '@/services/api/schemas';
import { PromptModal } from '@/components/ui/prompt-modal';
import { PropertyDetailHeadCard } from '@/components/property';
import { RenewLeaseModal } from '@/components/portfolio/renew-lease-modal';
import { ShoppingCart } from "lucide-react";
import { UpdateLeaseModal } from '@/components/portfolio/update-lease-modal';
import { cn } from "@/lib/utils";
import { createPortal } from 'react-dom';
import { propertyTypes } from '@/app/constants';
import { toast } from 'react-toastify';
import { useCountries } from '@/services/queries/hooks';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';

function AmenityCard({ label }: { label: string; quantity?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-4 rounded-2xl border border-gray-50 text-black text-xs bg-gray-50 shadow">
      <ShoppingCart className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

function LeaseActions({ lease }: { lease: Lease }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cancelLease = useCancelLease();

  const handleAction = (action: string) => {
    setIsDropdownOpen(false);
    switch (action) {
      // case 'edit':
      //   setIsUpdateModalOpen(true);
      //   break;
      case 'renew':
        setIsRenewModalOpen(true);
        break;
      case 'cancel':
        setIsCancelModalOpen(true);
        break;
    }
  };

  const handleCancelLease = async () => {
    try {
      const reason = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
      if (!reason) {
        toast.error('Please provide a reason for cancellation');
        return;
      }

      await cancelLease.mutateAsync({ 
        id: lease._id, 
        data: { reasonForTermination: reason } 
      });
      
      toast.success('Lease cancelled successfully');
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('Failed to cancel lease:', error);
      toast.error('Failed to cancel lease');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdown = document.querySelector('[data-dropdown]');
      
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(target) && !dropdown?.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-gray-500 hover:text-gray-700"
          disabled={lease.status === 'terminated'}
        >
          <MoreVertical className="h-5 w-5" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {/* <button
                onClick={() => handleAction('edit')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button> */}
              <button
                onClick={() => handleAction('renew')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Renew
              </button>
              {lease.status !== 'terminated' && (
                <button
                  onClick={() => handleAction('cancel')}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <PromptModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelLease}
        title="Cancel Lease"
        message={
          <div className="space-y-4">
            <p>Please provide a reason for cancelling this lease.</p>
            <textarea
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37]"
              rows={4}
              placeholder="Enter reason for cancellation..."
              required
            />
          </div>
        }
        confirmText="Confirm Cancellation"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
      />

      {/* Renew modal */}
      <RenewLeaseModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        leaseId={lease._id}
        currentLease={{
          startDate: lease.startDate,
          endDate: lease.endDate,
          rentalRate: lease.rentalRate,
          paymentFrequency: lease.paymentFrequency,
          notes: lease.notes,
          leaseAgreementUrl: lease.leaseAgreementUrl,
          additionalCharges: lease.additionalCharges,
          propertyId: lease.propertyId as string,
        }}
      />

      {/* Update modal */}
      <UpdateLeaseModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        lease={lease}
      />
    </>
  );
}

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { data: leases, isLoading: isLoadingLeases } = useLeases({ 
    propertyId: id,
    search: debouncedSearchTerm 
  });
  const [activeTab, setActiveTab] = useState('details');
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);
  const { data: countries } = useCountries();
  const updateProperty = useUpdateProperty();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditImagesModalOpen, setIsEditImagesModalOpen] = useState(false);
  const [isEditAmenitiesModalOpen, setIsEditAmenitiesModalOpen] = useState(false);

  // Form state
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);

  useEffect(() => {
    if (property) {
      setPropertyName(property.name);
      setPropertyType(property.type);
      setCountry(property.countryId);
      setAddress(property.address);
    }
  }, [property]);

  const handleGoBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      await updateProperty.mutateAsync({
        id,
        data: {
          name: propertyName,
          address: address,
          status: property?.status || 'listed',
          location: address,
          description: '',
        },
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update property:', error);
    }
  };

  const handleUpdateImages = async (imageUrls: string[]) => {
    if (!property) return;
    
    try {
      await updateProperty.mutateAsync({
        id,
        data: {
          name: property.name,
          address: property.address,
          status: property.status,
          location: property.address,
          description: '',
          imageUrls,
        },
      });
      toast.success('Property images updated successfully');
    } catch (error) {
      console.error('Failed to update property images:', error);
      toast.error('Failed to update property images');
    }
  };

  const handleUpdateAmenities = async (amenities: {
    [key: string]: {
      available: boolean;
      quantity: number;
    };
  }) => {
    if (!property) return;
    
    try {
      await updateProperty.mutateAsync({
        id,
        data: {
          name: property.name,
          address: property.address,
          status: property.status,
          location: property.address,
          description: '',
          amenities,
        },
      });
      toast.success('Property amenities updated successfully');
    } catch (error) {
      console.error('Failed to update property amenities:', error);
      toast.error('Failed to update property amenities');
    }
  };

  if (isLoading) {
    return (
      <Layout title="Property Details">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout title="Property Not Found">
        <div className="py-10 text-center">
          <h1 className="text-2xl font-semibold">Property not found</h1>
          <p className="mt-2 text-gray-500">
            The property you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={handleGoBack}
            className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { label: 'Details', value: 'details' },
    { label: 'Expenses', value: 'expenses' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  return (
    <Layout 
      title={property.name} 
      description={`Created on ${format(new Date(property.createdAt), 'do MMMM yyyy')}`}
    >
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Listings
        </button>
      </div>

      {/* Property details and tabs */}
      <div className="mb-6">
        <Tabs items={tabs} value={activeTab} onValueChange={setActiveTab} />

        {/* Search and actions */}
        {activeTab !== 'details' && (
          <div className="mt-6 mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="relative w-full sm:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}`}
                className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === 'expenses' && (
              <button
                onClick={() => setIsAddExpenseModalOpen(true)}
                className="hover:bg-opacity-90 rounded-md cursor-pointer bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
              >
                Add Expense
              </button>
            )}

            {activeTab === 'maintenance' && (
              <button
                onClick={() => setIsAddTicketModalOpen(true)}
                className="hover:bg-opacity-90 rounded-md cursor-pointer bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
              >
                Add Ticket
              </button>
            )}
          </div>
        )}

        <TabsContent value="details" activeValue={activeTab}>
          <PropertyDetailHeadCard
            title={property.name}
            address={property.address}
            type={property.type}
            price={property.rentalPrice}
            status={property.status}
            imageUrl={property.imageUrls[0]}
          />
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 p-4 lg:p-6 w-full">
            {/* Left Column - Property Details */}
            <div className="w-full lg:w-1/2 space-y-4 lg:space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Property Details</h2>
                <button 
                  className="text-sm text-gray-500 cursor-pointer"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4 lg:space-y-6">
                <FormField label="Name">
                  <input
                    type="text"
                    placeholder="Enter property name"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37] disabled:bg-gray-50"
                  />
                </FormField>

                <FormField label="Type">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    disabled={!isEditing}
                    className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37] disabled:bg-gray-50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNC42NjY3NSAxMkw4IDguNjY2NzVMMTEuMzMzMyAxMkwxMiAxMS4zMzMzTDggNy4zMzMzNUw0IDExLjMzMzNMNC42NjY3NSAxMloiIGZpbGw9IiM2QjcyODAiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
                  >
                    {Object.entries(propertyTypes).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <FormField label="Country">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37] disabled:bg-gray-50 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNC42NjY3NSAxMkw4IDguNjY2NzVMMTEuMzMzMyAxMkwxMiAxMS4zMzMzTDggNy4zMzMzNUw0IDExLjMzMzNMNC42NjY3NSAxMloiIGZpbGw9IiM2QjcyODAiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
                    >
                      {countries?.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Address">
                    <input
                      type="text"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37] disabled:bg-gray-50"
                    />
                  </FormField>
                </div>

                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#e36b37] text-white rounded-md hover:bg-opacity-90"
                    >
                      Save Changes
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-black text-base">Images</h3>
                    <button 
                      className="text-sm text-gray-500 cursor-pointer"
                      onClick={() => setIsEditImagesModalOpen(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <ImageGallery images={property.imageUrls.map(url => ({ id: url, src: url, alt: property.name })) || []} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-black text-base">Amenities</h3>
                    <button 
                      className="text-sm text-gray-500 cursor-pointer"
                      onClick={() => setIsEditAmenitiesModalOpen(true)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex overflow-x-auto gap-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible">
                    {Object.entries(property?.amenities || {}).map(([key, value]) => {
                      if (value.available) {
                        const displayName = key.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        return (
                          <AmenityCard 
                            key={key} 
                            label={displayName}
                            quantity={value.quantity}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Leases */}
            <div className="w-full lg:w-1/2 bg-white rounded-2xl shadow p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">Leases</h2>
                <button 
                  className="text-sm text-orange-500 flex items-center gap-1 cursor-pointer"
                  onClick={() => setIsAddLeaseModalOpen(true)}
                >
                  <span className="text-sm">＋</span> Add Lease
                </button>
              </div>

              <div className="relative mb-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search Lease"
                  className="w-full rounded-md border border-gray-200 py-2 pr-4 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search leases"
                />
              </div>

              <div className="space-y-4">
                {isLoadingLeases ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
                  </div>
                ) : (
                  <>
                    {leases?.items.length === 0 ? (
                      <>
                       <div className="overflow-x-auto">
                        <div className="flex justify-between px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[400px]">
                          <span className="w-[100px]">Date</span>
                          <span className="w-[100px]">Apartment</span>
                          <span className="w-[100px]">Amount Paid</span>
                          <span className="w-[100px]">Status</span>
                          <span className="w-[50px]">Actions</span>
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-8 text-center text-gray-500">
                        No leases found
                      </div>
                      </>
                    ) : (
                      leases?.items.map((lease: Lease, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="overflow-x-auto">
                            <div className="flex justify-between px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl min-w-[400px]">
                              <span className="w-[100px]">Date</span>
                              <span className="w-[100px]">Apartment</span>
                              <span className="w-[100px]">Amount Paid</span>
                              <span className="w-[100px]">Status</span>
                              <span className="w-[50px]">Actions</span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between min-w-[400px]">
                              <div className="w-[100px]">
                                <p className="text-sm font-medium text-gray-900">
                                  {format(parseISO(lease.startDate), 'MMMM yyyy')}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {format(parseISO(lease.startDate), 'h:mm a')}
                                </p>
                              </div>
                              <div className="w-[100px]">
                                <p className="text-sm font-medium text-gray-900">{lease.property.name}</p>
                                <p className="text-xs text-gray-500">{lease.property.address}</p>
                              </div>
                              
                              <div className="w-[100px]">
                                <p className="text-sm font-medium text-gray-900">{lease.rentalRate}</p>
                                <p className="text-xs text-gray-500">{lease.paymentFrequency}</p>
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
                              <div className="w-[50px]">
                                <LeaseActions lease={lease} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expenses" activeValue={activeTab}>
          <ExpensesTab searchTerm={searchTerm} propertyId={id} />
        </TabsContent>

        <TabsContent value="maintenance" activeValue={activeTab}>
          <MaintenanceTab searchTerm={searchTerm} propertyId={id} />
        </TabsContent>
      </div>

      <AddLeaseModal
        isOpen={isAddLeaseModalOpen}
        onClose={() => setIsAddLeaseModalOpen(false)}
        propertyId={id}
        propertyName={property?.name}
      />

      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        portfolioId=""
        propertyId={id}
      />

      <AddTicketModal
        isOpen={isAddTicketModalOpen}
        onClose={() => setIsAddTicketModalOpen(false)}
        portfolioId=""
        propertyId={id}
      />

      <EditImagesModal
        isOpen={isEditImagesModalOpen}
        onClose={() => setIsEditImagesModalOpen(false)}
        currentImages={property.imageUrls}
        onSave={handleUpdateImages}
      />

      <EditAmenitiesModal
        isOpen={isEditAmenitiesModalOpen}
        onClose={() => setIsEditAmenitiesModalOpen(false)}
        currentAmenities={property?.amenities || {}}
        onSave={handleUpdateAmenities}
      />
    </Layout>
  );
}
