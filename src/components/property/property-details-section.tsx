'use client';

import { ChevronDown } from 'lucide-react';
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

interface PropertyDetailsSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

const propertyTypes = [
  'Apartment',
  'House',
  'Villa',
  'Condo',
  'Townhouse',
  'Cabin',
  'Cottage',
];

const countries = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United States',
  'United Kingdom',
  'Canada',
];

export function PropertyDetailsSection({
  formData,
  updateFormData,
}: PropertyDetailsSectionProps) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  return (
    <div className="space-y-6">
      {/* Property Name */}
      <div>
        <label
          htmlFor="property-name"
          className="mb-1 block text-xs font-medium text-gray-700"
        >
          Property Name
        </label>
        <input
          type="text"
          id="property-name"
          value={formData.name}
          onChange={e => updateFormData('name', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
          placeholder="Name"
          required
        />
      </div>

      {/* Property Type */}
      <div className="!overflow-visible">
        <label
          htmlFor="property-type"
          className="mb-1 block text-xs font-medium text-gray-700"
        >
          Property Type
        </label>
        <div className="relative !overflow-visible">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            aria-haspopup="listbox"
            aria-expanded={showTypeDropdown}
            id="property-type"
          >
            <span>{formData.type || 'Type'}</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showTypeDropdown && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
              <ul
                className="py-1"
                role="listbox"
                aria-labelledby="property-type"
              >
                {propertyTypes.map(type => (
                  <li
                    key={type}
                    role="option"
                    aria-selected={formData.type === type}
                    className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                      formData.type === type ? 'bg-gray-100' : ''
                    }`}
                    onClick={() => {
                      updateFormData('type', type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    {type}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Country and Address */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Country */}
        <div className="!overflow-visible">
          <label
            htmlFor="country"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Country
          </label>
          <div className="relative !overflow-visible">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              aria-haspopup="listbox"
              aria-expanded={showCountryDropdown}
              id="country"
            >
              <span>{formData.country || 'Country'}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {showCountryDropdown && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                <ul className="py-1" role="listbox" aria-labelledby="country">
                  {countries.map(country => (
                    <li
                      key={country}
                      role="option"
                      aria-selected={formData.country === country}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        formData.country === country ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        updateFormData('country', country);
                        setShowCountryDropdown(false);
                      }}
                    >
                      {country}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={e => updateFormData('address', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            placeholder="Address"
          />
        </div>
      </div>
    </div>
  );
}
