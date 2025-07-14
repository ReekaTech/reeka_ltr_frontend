'use client';

import { ChevronDown, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { AmenitiesModal } from './amenities-modal';
import { PropertyFormData } from '@/services/api/schemas';

interface AmenitiesSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function AmenitiesSection({
  formData,
  updateFormData,
}: AmenitiesSectionProps) {
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [showBedroomDropdown, setShowBedroomDropdown] = useState(false);
  const [showBathroomDropdown, setShowBathroomDropdown] = useState(false);
  const bedroomDropdownRef = useRef<HTMLDivElement>(null);
  const bathroomDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bedroomDropdownRef.current && !bedroomDropdownRef.current.contains(event.target as Node)) {
        setShowBedroomDropdown(false);
      }
      if (bathroomDropdownRef.current && !bathroomDropdownRef.current.contains(event.target as Node)) {
        setShowBathroomDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBedroomChange = (value: number) => {
    updateFormData('rooms', { ...formData.rooms, bedrooms: value });
    setShowBedroomDropdown(false);
  };

  const handleBathroomChange = (value: number) => {
    updateFormData('rooms', { ...formData.rooms, bathrooms: value });
    setShowBathroomDropdown(false);
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
          <h3 className="mb-1 text-sm font-medium">Bed Room and Bath</h3>
          <p className="mb-5 text-xs font-light text-gray-500">
            Type in the amenities you have or select from the options below
          </p>

          {/* Bedrooms */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <label htmlFor="bedrooms" className="text-sm">
                Bed Room
              </label>
              <p className="text-xs text-gray-500">Select number of bedrooms</p>
            </div>
            <div className="relative" ref={bedroomDropdownRef}>
              <button
                type="button"
                onClick={() => setShowBedroomDropdown(!showBedroomDropdown)}
                className="flex items-center justify-between w-32 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>
                  {formData.rooms.bedrooms === 0 ? 'Studio' : `${formData.rooms.bedrooms} Bedroom${formData.rooms.bedrooms > 1 ? 's' : ''}`}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {showBedroomDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <button
                    onClick={() => handleBedroomChange(0)}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100"
                  >
                    Studio
                  </button>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleBedroomChange(num)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      {num} Bedroom{num > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

         

          {/* Bathrooms */}
          <div className="flex items-center justify-between mb-6">
            <label htmlFor="bathrooms" className="text-sm">
              Baths
            </label>
            <div className="relative" ref={bathroomDropdownRef}>
              <button
                type="button"
                onClick={() => setShowBathroomDropdown(!showBathroomDropdown)}
                className="flex items-center justify-between w-32 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>
                  {formData.rooms.bathrooms} Bathroom{formData.rooms.bathrooms > 1 ? 's' : ''}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              
              {showBathroomDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-32 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handleBathroomChange(num)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      {num} Bathroom{num > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>

        {/* Amenities Selection */}
        <div>
          <div className="mb-3">
            <h3 className="text-sm font-medium">Amenities</h3>
            <p className="text-xs font-light text-gray-500">Select available amenities for this property</p>
          </div>

          {/* Amenity Sections */}
          <div className="mb-4 flex flex-wrap gap-3">
            {Object.entries(formData.amenities).map(([amenity, details]) => (
              <div
                key={amenity}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-200"
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
                <button
                  type="button"
                  onClick={() => handleRemoveAmenity(amenity)}
                  className="ml-2 text-gray-400 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Amenities Button */}
          <button
            type="button"
            onClick={() => setShowAmenitiesModal(true)}
            className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manage Amenities
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
