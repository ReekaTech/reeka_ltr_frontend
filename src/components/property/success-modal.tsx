'use client';

import { useEffect, useState } from 'react';

import { CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { usePropertyForm } from './property-form-context';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  onClose: () => void;
}

export function SuccessModal({ onClose }: SuccessModalProps) {
  const { resetForm } = usePropertyForm();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to listings when countdown reaches 0
      handleViewListings();
    }
  }, [countdown]);

  const handleAddAnother = () => {
    resetForm();
    onClose();
  };

  const handleViewListings = () => {
    resetForm();
    router.push('/listings');
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleViewListings}
      />

      {/* Modal */}
      <div
        className="z-[1001] mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">
            Property Added Successfully
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your property has been added to the system.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-gray-500">
            Redirecting to listings in {countdown} seconds...
          </p>

          <button
            onClick={handleViewListings}
            className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-2 text-white transition-all"
          >
            View Listings
          </button>

          <button
            onClick={handleAddAnother}
            className="w-full rounded-md border border-gray-200 py-2 text-gray-600 transition-colors hover:bg-gray-50"
          >
            Add Another Property
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
