'use client';

import {
  ArrowLeft,
  Search,
} from 'lucide-react';
import { ExpensesTab, MaintenanceTab } from '@/components/portfolio/tabs';
import { ImageGallery, Layout, Tabs, TabsContent } from '@/components/ui';
import { useEffect, useState } from 'react';

import { AddLeaseModal } from '@/components/portfolio/add-lease-modal';
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { PropertyDetailHeadCard } from '@/components/property';
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

// Sample property data
const properties = {
  prop1: {
    id: 'prop1',
    title: '3 Bedroom Apartment in Lekki',
    address: '123 Admiralty Way, Lekki Phase 1, Lagos',
    type: 'Apartment',
    status: 'Occupied',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    rent: 5000000,
    images: [
      { id: '1', src: 'https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800&q=80', alt: 'Living room' },
      { id: '2', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Kitchen' },
      { id: '3', src: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&q=80', alt: 'Bedroom' },
      { id: '3', src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'Bedroom' },
      { id: '3', src: 'https://images.unsplash.com/photo-1599423300795-f31c51b7c0e5?w=800&q=80', alt: 'Bedroom' },
    ],
    tenant: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+234 801 234 5678',
      occupants: 2,
      leaseStart: '01 Jan 2023',
      leaseEnd: '31 Dec 2023',
    },
  },
  prop2: {
    id: 'prop2',
    title: '4 Bedroom Duplex in Ikoyi',
    address: '456 Bourdillon Road, Ikoyi, Lagos',
    type: 'Duplex',
    status: 'Vacant',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    rent: 12000000,
    images: [
      { id: '1', src: 'https://images.unsplash.com/photo-1586105251261-72a756497a12?w=800&q=80', alt: 'Living room' },
      { id: '2', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Kitchen' },
      { id: '3', src: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&q=80', alt: 'Bedroom' },
      { id: '3', src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'Bedroom' },
      { id: '3', src: 'https://images.unsplash.com/photo-1599423300795-f31c51b7c0e5?w=800&q=80', alt: 'Bedroom' },
    ],
    tenant: null,
  },
};

const amenities = [
  "Swimming Pool",
  "Gym",
  "Parking",
  "Security",
];

function AmenityCard({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-gray-50 text-black text-xs bg-gray-50 shadow">
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

export default function PropertyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddLeaseModalOpen, setIsAddLeaseModalOpen] = useState(false);

  // Form state
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [leases] = useState([
    { date: "Dec 14", time: "12:00PM", apartment: "Ama's Nest", address: "Lagos Island, Nigeria", amount: "$4000", status: "Ongoing" },
    { date: "Dec 14", time: "12:00PM", apartment: "Ama's Nest", address: "Lagos Island, Nigeria", amount: "$4000", status: "Completed" },
    { date: "Dec 14", time: "12:00PM", apartment: "Ama's Nest", address: "Lagos Island, Nigeria", amount: "$4000", status: "Completed" }
  ]);

  const images = [
    { id: '1', src: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&q=80', alt: 'Living room' },
    { id: '2', src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Kitchen' },
    { id: '3', src: 'https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&q=80', alt: 'Bedroom' },
    { id: '3', src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'Bedroom' },
    { id: '3', src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', alt: 'Bedroom' },
  ]

  useEffect(() => {
    // In a real app, fetch property data from API
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setProperty(properties[params.id as keyof typeof properties]);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
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
    <Layout title={property.title} description={property.address}>
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
                className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 whitespace-nowrap text-white transition-all"
              >
                Add Expense
              </button>
            )}
          </div>
        )}

        <TabsContent value="details" activeValue={activeTab}>
          <PropertyDetailHeadCard
            title="Ama's Nest"
            address="24 Drive, Lagos Island, Nigeria"
            type="Apartment"
            price={1000}
            status="Booked"
          />
          <div className="flex flex-col md:flex-row gap-8 p-6 w-full">
            {/* Left Column - Property Details */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Property Details</h2>
                <button className="text-sm text-gray-500 cursor-pointer">Edit</button>
              </div>

              <div className="space-y-6">
                <FormField label="Name">
                  <input
                    type="text"
                    placeholder="Enter property name"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37]"
                  />
                </FormField>

                <FormField label="Type">
                  <input
                    type="text"
                    placeholder="Enter property type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37]"
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Country">
                    <input
                      type="text"
                      placeholder="Enter country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37]"
                    />
                  </FormField>

                  <FormField label="Address">
                    <input
                      type="text"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm focus:border-[#e36b37] focus:ring-1 focus:ring-[#e36b37]"
                    />
                  </FormField>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-black text-base">Images</h3>
                    <button className="text-sm text-gray-500 cursor-pointer">Edit</button>
                  </div>
                  <ImageGallery images={images} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-black text-base">Amenities</h3>
                    <button className="text-sm text-gray-500 cursor-pointer">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((item, index) => (
                      <AmenityCard key={index} label={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Leases */}
            <div className="flex-1 bg-white rounded-2xl shadow p-6">
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
                {leases.map((lease, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-t-xl">
                      <span className="w-1/4">Date</span>
                      <span className="w-1/4">Apartment</span>
                      <span className="w-1/4">Amount Paid</span>
                      <span className="w-1/4">Status</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-b-xl px-4 py-3 flex items-center justify-between">
                      <div className="w-1/4">
                        <p className="text-sm font-medium text-gray-900">{lease.date}</p>
                        <p className="text-xs text-gray-500">{lease.time}</p>
                      </div>
                      <div className="w-1/4">
                        <p className="text-sm font-medium text-gray-900">{lease.apartment}</p>
                        <p className="text-xs text-gray-500">{lease.address}</p>
                      </div>
                      <div className="w-1/4">
                        <p className="text-sm font-medium text-gray-900">{lease.amount}</p>
                        <p className="text-xs text-gray-500">For 3 days</p>
                      </div>
                      <div className="w-1/4 flex justify-end">
                        <Badge
                          className={cn(
                            "text-xs font-medium px-3 py-1 rounded-full",
                            lease.status === "Ongoing"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {lease.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="expenses" activeValue={activeTab}>
          <ExpensesTab searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="maintenance" activeValue={activeTab}>
          <MaintenanceTab searchTerm={searchTerm} />
        </TabsContent>
      </div>

      <AddLeaseModal
        isOpen={isAddLeaseModalOpen}
        onClose={() => setIsAddLeaseModalOpen(false)}
        propertyId={params.id}
        propertyName={property?.title}
      />
    </Layout>
  );
}
