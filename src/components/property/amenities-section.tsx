'use client';

import { Plus, X } from 'lucide-react';

import { AmenitiesModal } from './amenities-modal';
import { PropertyFormData } from '@/services/api/schemas';
import { useState } from 'react';

interface AmenitiesSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function AmenitiesSection({
  formData,
  updateFormData,
}: AmenitiesSectionProps) {
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);

  const handleBedroomChange = (value: number) => {
    updateFormData('rooms', { ...formData.rooms, bedrooms: Math.max(1, value) });
  };

  const handleBathroomChange = (value: number) => {
    updateFormData('rooms', { ...formData.rooms, bathrooms: Math.max(1, value) });
  };

  const handleRemoveAmenity = (amenity: string) => {
    const { [amenity]: _, ...rest } = formData.amenities;
    updateFormData('amenities', rest);
  };

  const handleAddAmenities = (amenities: { [key: string]: { available: boolean; quantity?: number } }) => {
    updateFormData('amenities', amenities);
    setShowAmenitiesModal(false);
  };

  const handleToggleAmenity = (amenity: string) => {
    updateFormData('amenities', {
      ...formData.amenities,
      [amenity]: {
        available: !formData.amenities[amenity]?.available,
        quantity: !formData.amenities[amenity]?.available ? 0 : undefined
      }
    });
  };

  return (
    <div className="">
      <div className="rounded-m">
        {/* Bedroom and Bath Section */}
        <div className="">
          <h3 className="mb-1 text-sm font-medium">BedRoom and Bath</h3>
          <p className="mb-5 text-xs font-light text-gray-500">
            Type in the amenities you have or select from the options below
          </p>

          {/* Bedrooms */}
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="bedrooms" className="text-sm">
              BedRoom
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleBedroomChange(formData.rooms.bedrooms - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Decrease bedrooms"
              >
                -
              </button>
              <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                {formData.rooms.bedrooms}
              </span>
              <button
                type="button"
                onClick={() => handleBedroomChange(formData.rooms.bedrooms + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Increase bedrooms"
              >
                +
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center justify-between mb-6 ">
            <label htmlFor="bathrooms" className="text-sm">
              Baths
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleBathroomChange(formData.rooms.bathrooms - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Decrease bathrooms"
              >
                -
              </button>
              <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                {formData.rooms.bathrooms}
              </span>
              <button
                type="button"
                onClick={() => handleBathroomChange(formData.rooms.bathrooms + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Increase bathrooms"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-medium">Amenities</h3>
            <p className="text-xs font-light text-gray-500">Select and add</p>
          </div>

          {/* Amenity Sections */}
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(formData.amenities).map(([amenity, details]) => (
              <div
                key={amenity}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                <span className="text-sm">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Add Facility Button */}
          <button
            type="button"
            onClick={() => setShowAmenitiesModal(true)}
            className="flex items-center text-sm text-green-600"
          >
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-green-600">
              <Plus className="h-4 w-4" />
            </div>
            Add / Remove Facility / Equipment
          </button>
        </div>
      </div>

      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <AmenitiesModal
          selectedAmenities={formData.amenities}
          onSave={handleAddAmenities}
          onClose={() => setShowAmenitiesModal(false)}
        />
      )}
    </div>
  );
}
