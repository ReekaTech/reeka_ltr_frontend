'use client';

import {
  ArrowLeft,
  Banknote,
  Calendar,
  Home,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';
import { ExpensesTab, MaintenanceTab } from '@/components/portfolio/tabs';
import { ImageGallery, Layout, Tabs, TabsContent } from '@/components/ui';
import { useEffect, useState } from 'react';

import Link from 'next/link';
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
      { id: '1', src: '/images/property1.jpg', alt: 'Living room' },
      { id: '2', src: '/images/property2.jpg', alt: 'Kitchen' },
      { id: '3', src: '/images/property3.jpg', alt: 'Bedroom' },
      { id: '4', src: '/images/property4.jpg', alt: 'Bathroom' },
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
      { id: '1', src: '/images/property5.jpg', alt: 'Living room' },
      { id: '2', src: '/images/property6.jpg', alt: 'Kitchen' },
      { id: '3', src: '/images/property7.jpg', alt: 'Bedroom' },
    ],
    tenant: null,
  },
};

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

        <TabsContent value="details" activeValue={activeTab}>
          <div></div>
        </TabsContent>

        <TabsContent value="expenses" activeValue={activeTab}>
          <div className="mt-6">
            <ExpensesTab searchTerm={searchTerm} />
          </div>
        </TabsContent>

        <TabsContent value="maintenance" activeValue={activeTab}>
          <div className="mt-6">
            <MaintenanceTab searchTerm={searchTerm} />
          </div>
        </TabsContent>
      </div>
    </Layout>
  );
}
