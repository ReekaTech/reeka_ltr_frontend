'use client';

import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

interface AmenitiesModalProps {
  selectedAmenities: string[];
  onSave: (amenities: string[]) => void;
  onClose: () => void;
}

const commonAmenities = [
  'Swimming Pool',
  'Griller',
  'Bathroom',
  'Basketball court',
  'Gym',
  'WiFi',
  'Air Conditioning',
  'Kitchen',
  'Parking',
  'TV',
  'Washer',
  'Dryer',
];

export function AmenitiesModal({
  selectedAmenities,
  onSave,
  onClose,
}: AmenitiesModalProps) {
  const [amenities, setAmenities] = useState<string[]>([...selectedAmenities]);
  const [inputValue, setInputValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle mounted state for SSR
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Focus the input field when the modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddAmenity = (amenity: string) => {
    if (amenity.trim() && !amenities.includes(amenity.trim())) {
      setAmenities([...amenities, amenity.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const handleToggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      handleRemoveAmenity(amenity);
    } else {
      handleAddAmenity(amenity);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="z-[1001] mx-4 w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="amenities-modal-title"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 text-gray-500 hover:text-gray-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2
              id="amenities-modal-title"
              className="text-xl font-medium text-gray-800"
            >
              Add Amenities
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Type in the amenities you have or select from the options below
          </p>
        </div>

        <div className="p-6">
          {/* Common amenities */}
          <div className="mb-6 flex flex-wrap gap-2">
            {commonAmenities.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleToggleAmenity(amenity)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  amenities.includes(amenity)
                    ? 'bg-green-500 text-white'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>

          {/* Selected amenities with input */}
          <div className="mb-6 rounded-lg border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200">
            <div className="flex flex-wrap items-center p-3">
              {amenities.map(amenity => (
                <div
                  key={amenity}
                  className="m-1 flex items-center rounded-full bg-green-500 px-3 py-1 text-sm text-white"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    className="ml-2 flex h-4 w-4 items-center justify-center rounded-full hover:bg-green-600"
                    aria-label={`Remove ${amenity}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="min-w-[180px] flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAmenity(inputValue);
                    }
                  }}
                  placeholder="Type Amenities"
                  className="w-full rounded-md border-none bg-gray-50 px-2 py-1.5 text-sm outline-none focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onSave(amenities)}
              className="px-8 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
