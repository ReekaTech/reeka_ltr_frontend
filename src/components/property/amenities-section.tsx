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
                    checked={!!formData.amenities['Swimming Pool']?.available}
                    onChange={() => handleToggleAmenity('Swimming Pool')}
                  />
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-green-500"></div>
                  {!!formData.amenities['Swimming Pool']?.available && (
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
                  onClick={() => {
                    if ((formData.amenities['Swimming Pool']?.quantity ?? 0) > 0) {
                      updateFormData('amenities', {
                        ...formData.amenities,
                        'Swimming Pool': {
                          ...formData.amenities['Swimming Pool'],
                          quantity: (formData.amenities['Swimming Pool']?.quantity ?? 0) - 1
                        }
                      });
                    }
                  }}
                  disabled={!formData.amenities['Swimming Pool']?.available}
                  className={`flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 ${
                    formData.amenities['Swimming Pool']?.available ? 'bg-gray-50 text-gray-600' : 'bg-gray-100 text-gray-400'
                  }`}
                  aria-label="Decrease swimming pools"
                >
                  -
                </button>
                <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                  {formData.amenities['Swimming Pool']?.quantity || 0}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    updateFormData('amenities', {
                      ...formData.amenities,
                      'Swimming Pool': {
                        ...formData.amenities['Swimming Pool'],
                        quantity: (formData.amenities['Swimming Pool']?.quantity || 0) + 1
                      }
                    });
                  }}
                  disabled={!formData.amenities['Swimming Pool']?.available}
                  className={`flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 ${
                    formData.amenities['Swimming Pool']?.available ? 'bg-gray-50 text-gray-600' : 'bg-gray-100 text-gray-400'
                  }`}
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
                    checked={!!formData.amenities['Basketball Court']?.available}
                    onChange={() => handleToggleAmenity('Basketball Court')}
                  />
                  <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-green-500"></div>
                  {!!formData.amenities['Basketball Court']?.available && (
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
                  onClick={() => {
                    if ((formData.amenities['Basketball Court']?.quantity ?? 0) > 0) {
                      updateFormData('amenities', {
                        ...formData.amenities,
                        'Basketball Court': {
                          ...formData.amenities['Basketball Court'],
                          quantity: (formData.amenities['Basketball Court']?.quantity ?? 0) - 1
                        }
                      });
                    }
                  }}
                  disabled={!formData.amenities['Basketball Court']?.available}
                  className={`flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-300 ${
                    formData.amenities['Basketball Court']?.available ? 'bg-gray-50 text-gray-600' : 'bg-gray-100 text-gray-400'
                  }`}
                  aria-label="Decrease basketball courts"
                >
                  -
                </button>
                <span className="flex h-8 w-8 items-center justify-center border-t border-b border-gray-300 bg-white text-sm">
                  {formData.amenities['Basketball Court']?.quantity || 0}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    updateFormData('amenities', {
                      ...formData.amenities,
                      'Basketball Court': {
                        ...formData.amenities['Basketball Court'],
                        quantity: (formData.amenities['Basketball Court']?.quantity || 0) + 1
                      }
                    });
                  }}
                  disabled={!formData.amenities['Basketball Court']?.available}
                  className={`flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-300 ${
                    formData.amenities['Basketball Court']?.available ? 'bg-gray-50 text-gray-600' : 'bg-gray-100 text-gray-400'
                  }`}
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
