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
    <Layout title="Add Property" description="Add a new property to your listings">
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
        

        {/* Property Form with Context Provider */}
        <PropertyFormProvider>
          <AddPropertyForm />
        </PropertyFormProvider>
      </div>
    </Layout>
  );
}
