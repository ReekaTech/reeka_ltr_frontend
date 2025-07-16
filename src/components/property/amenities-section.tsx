'use client';

import { ChevronDown, Minus, Plus, X } from 'lucide-react';
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

  const incrementBedroom = () => {
    const newValue = Math.min(formData.rooms.bedrooms + 1, 10);
    updateFormData('rooms', { ...formData.rooms, bedrooms: newValue });
  };

  const decrementBedroom = () => {
    const newValue = Math.max(formData.rooms.bedrooms - 1, 0);
    updateFormData('rooms', { ...formData.rooms, bedrooms: newValue });
  };

  const incrementBathroom = () => {
    const newValue = Math.min(formData.rooms.bathrooms + 1, 10);
    updateFormData('rooms', { ...formData.rooms, bathrooms: newValue });
  };

  const decrementBathroom = () => {
    const newValue = Math.max(formData.rooms.bathrooms - 1, 1);
    updateFormData('rooms', { ...formData.rooms, bathrooms: newValue });
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

  // Dynamic header and label based on bedroom count
  const headerText = formData.rooms.bedrooms === 0 ? 'Studio and Bath' : 'BedRoom and Bath';
  const bedroomLabel = formData.rooms.bedrooms === 0 ? 'Studio' : 'BedRoom';

  return (
    <div className="">
      <div className="rounded-m">
        {/* Bedroom and Bath Section */}
        <div className="">
          <h3 className="mb-1 text-sm font-medium">{headerText}</h3>
          <p className="mb-5 text-xs font-light text-gray-500">
            Type in the amenities you have or select from the options below
          </p>

          {/* Bedrooms */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">
                {bedroomLabel}
              </label>
            </div>
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
              <button
                type="button"
                onClick={decrementBedroom}
                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                className={`flex items-center justify-center text-gray-600 transition-colors cursor-pointer ${
                  formData.rooms.bedrooms === 0 
                    ? 'bg-gray-100' 
                    : 'bg-white shadow-sm hover:bg-gray-50'
                }`}
                disabled={formData.rooms.bedrooms === 0}
              >
                <Minus className="h-2.5 w-2.5" />
              </button>
              <span className="mx-3 text-xs font-medium min-w-[1rem] text-center">
                {formData.rooms.bedrooms}
              </span>
              <button
                type="button"
                onClick={incrementBedroom}
                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                className="flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                disabled={formData.rooms.bedrooms === 10}
              >
                <Plus className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center justify-between mb-6">
            <label className="text-sm font-medium">
              Baths
            </label>
            <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
              <button
                type="button"
                onClick={decrementBathroom}
                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                className={`flex items-center justify-center text-gray-600 transition-colors cursor-pointer ${
                  formData.rooms.bathrooms === 1 
                    ? 'bg-gray-100' 
                    : 'bg-white shadow-sm hover:bg-gray-50'
                }`}
                disabled={formData.rooms.bathrooms === 1}
              >
                <Minus className="h-2.5 w-2.5" />
              </button>
              <span className="mx-3 text-xs font-medium min-w-[1rem] text-center">
                {formData.rooms.bathrooms}
              </span>
              <button
                type="button"
                onClick={incrementBathroom}
                style={{ width: '20px', height: '20px', borderRadius: '50%' }}
                className="flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors bg-white cursor-pointer"
                disabled={formData.rooms.bathrooms === 10}
              >
                <Plus className="h-2.5 w-2.5" />
              </button>
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
