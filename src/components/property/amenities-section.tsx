'use client';

import { Plus, X } from 'lucide-react';

import { AmenitiesModal } from './amenities-modal';
import { useState } from 'react';

type PropertyFormData = {
  name: string;
  type: string;
  country: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: File[];
  basePrice: string;
  minPrice: string;
  maxPrice: string;
};

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
    updateFormData('bedrooms', Math.max(1, value));
  };

  const handleBathroomChange = (value: number) => {
    updateFormData('bathrooms', Math.max(1, value));
  };

  const handleRemoveAmenity = (amenity: string) => {
    updateFormData(
      'amenities',
      formData.amenities.filter(a => a !== amenity),
    );
  };

  const handleAddAmenities = (amenities: string[]) => {
    updateFormData('amenities', amenities);
    setShowAmenitiesModal(false);
  };

  const handleToggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      handleRemoveAmenity(amenity);
    } else {
      updateFormData('amenities', [...formData.amenities, amenity]);
    }
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
                onClick={() => handleBedroomChange(formData.bedrooms - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Decrease bedrooms"
              >
                -
              </button>
              <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                {formData.bedrooms}
              </span>
              <button
                type="button"
                onClick={() => handleBedroomChange(formData.bedrooms + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Increase bedrooms"
              >
                +
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center justify-between">
            <label htmlFor="bathrooms" className="text-sm">
              Baths
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleBathroomChange(formData.bathrooms - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                aria-label="Decrease bathrooms"
              >
                -
              </button>
              <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                {formData.bathrooms}
              </span>
              <button
                type="button"
                onClick={() => handleBathroomChange(formData.bathrooms + 1)}
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
            <p className="text-xs font-light text-gray-500">Select or add</p>
          </div>

          {/* Amenity Checkboxes */}
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.amenities.includes('Swimming Pool')}
                    onChange={() => handleToggleAmenity('Swimming Pool')}
                  />
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-green-500"></div>
                  {formData.amenities.includes('Swimming Pool') && (
                    <svg
                      className="absolute h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm">Swimming Pool</span>
              </label>

              <div className="flex items-center">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                  aria-label="Decrease swimming pools"
                >
                  -
                </button>
                <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                  1
                </span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600"
                  aria-label="Increase swimming pools"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <div className="relative flex h-5 w-5 items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={formData.amenities.includes('Basketball Court')}
                    onChange={() => handleToggleAmenity('Basketball Court')}
                  />
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-green-500"></div>
                  {formData.amenities.includes('Basketball Court') && (
                    <svg
                      className="absolute h-3.5 w-3.5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm">Basketball Court</span>
              </label>

              <div className="flex items-center">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 bg-gray-50 text-gray-600"
                  aria-label="Decrease basketball courts"
                >
                  -
                </button>
                <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                  1
                </span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 bg-gray-50 text-gray-600"
                  aria-label="Increase basketball courts"
                >
                  +
                </button>
              </div>
            </div>
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
            Add new facility/Equipment
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
