'use client';

import { useEffect, useRef, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { PropertyFormData } from '@/services/api/schemas';
import { propertyTypes } from '@/app/constants';
import { useCountries } from '@/services/queries/hooks';
import { useFormikContext } from 'formik';
import { useSession } from 'next-auth/react';
import { useUsers } from '@/services/queries/hooks/useUser';

interface PropertyDetailsSectionProps {
  formData: PropertyFormData;
  updateFormData: (field: keyof PropertyFormData, value: any) => void;
}

export function PropertyDetailsSection({
  formData,
  updateFormData,
}: PropertyDetailsSectionProps) {
  const { errors, touched } = useFormikContext<PropertyFormData>();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const { data: session } = useSession();
  const { data: users, isLoading: isUsersLoading } = useUsers({organizationId: session?.user?.organizationId});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setShowContactDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries?.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredUsers = users?.items?.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(contactSearch.toLowerCase())
  );

  if (isCountriesLoading || isUsersLoading) {
    return <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>;
  }

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
        {errors.name && touched.name && (
          <div className="mt-1 text-sm text-red-500">{errors.name}</div>
        )}
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <span>{formData.type ? propertyTypes[formData.type as keyof typeof propertyTypes] : 'Type'}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {errors.type && touched.type && (
              <div className="mt-1 text-sm text-red-500">{errors.type}</div>
            )}
            {showTypeDropdown && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                <ul
                  className="py-1"
                  role="listbox"
                  aria-labelledby="property-type"
                >
                  {Object.entries(propertyTypes).map(([key, displayName]) => (
                    <li
                      key={key}
                      role="option"
                      aria-selected={formData.type === key}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        formData.type === key ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        updateFormData('type', key);
                        setShowTypeDropdown(false);
                      }}
                    >
                      {displayName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

         {/* Contact Person */}
        <div className="!overflow-visible" ref={contactDropdownRef}>
          <label
            htmlFor="contact-person"
            className="mb-1 block text-xs font-medium text-gray-700"
          >
            Contact Person
          </label>
          <div className="relative !overflow-visible">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              onClick={() => setShowContactDropdown(!showContactDropdown)}
              aria-haspopup="listbox"
              aria-expanded={showContactDropdown}
              id="contact-person"
            >
              <span>
                {users?.items?.find(u => u.id === formData.contactPerson)
                  ? `${users.items.find(u => u.id === formData.contactPerson)?.firstName} ${users.items.find(u => u.id === formData.contactPerson)?.lastName}`
                  : 'Select Contact'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {errors.contactPerson && touched.contactPerson && (
              <div className="mt-1 text-sm text-red-500">{errors.contactPerson}</div>
            )}
            {showContactDropdown && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                <div className="sticky top-0 border-b border-gray-200 bg-white p-2">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    value={contactSearch}
                    onChange={(e) => setContactSearch(e.target.value)}
                  />
                </div>
                <ul className="py-1" role="listbox" aria-labelledby="contact-person">
                  {filteredUsers?.map(user => (
                    <li
                      key={user.id}
                      role="option"
                      aria-selected={formData.contactPerson === user.id}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        formData.contactPerson === user.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        updateFormData('contactPerson', user.id);
                        setShowContactDropdown(false);
                      }}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Country and Address */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Country */}
        <div className="!overflow-visible" ref={countryDropdownRef}>
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
              <span>{countries?.find(c => c.id === formData.countryId)?.name || 'Country'}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {errors.countryId && touched.countryId && (
              <div className="mt-1 text-sm text-red-500">{errors.countryId}</div>
            )}
            {showCountryDropdown && (
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                <div className="sticky top-0 border-b border-gray-200 bg-white p-2">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                  />
                </div>
                <ul className="py-1" role="listbox" aria-labelledby="country">
                  {filteredCountries?.map(country => (
                    <li
                      key={country.id}
                      role="option"
                      aria-selected={formData.countryId === country.id}
                      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                        formData.countryId === country.id ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => {
                        updateFormData('countryId', country.id);
                        setShowCountryDropdown(false);
                      }}
                    >
                      {country.name}
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
          {errors.address && touched.address && (
            <div className="mt-1 text-sm text-red-500">{errors.address}</div>
          )}
        </div>
      </div>

     
    </div>
  );
}
