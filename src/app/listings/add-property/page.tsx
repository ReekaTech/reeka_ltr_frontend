'use client';

import { AddPropertyForm, PropertyFormProvider } from '@/components/property';

import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function AddPropertyPage() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500">
          <button
            onClick={handleGoBack}
            className="flex items-center hover:text-gray-700"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Listing Management</span>
          </button>
          <span className="mx-2">/</span>
          <span>Add Property</span>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-normal font-extrabold">Add Property</h1>
          <p className="text-sm font-light text-gray-500">
            Manage your bookings with ease.
          </p>
        </div>

        {/* Property Form with Context Provider */}
        <PropertyFormProvider>
          <AddPropertyForm />
        </PropertyFormProvider>
      </div>
    </Layout>
  );
}
