'use client';

import { useEffect, useState } from 'react';
import { useUpdateUser, useUser } from '@/services/queries/hooks/useUser';

import type React from 'react';
import { useCountries } from '@/services/queries/hooks';
import { useSession } from 'next-auth/react';

export function ProfileForm() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: user, isLoading: isUserLoading } = useUser(userId);
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    phoneCountryCode: '',
  });
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        lastName: user.lastName || '',
        firstName: user.firstName || '',
        email: user.email || '',
        phone: user.phone || '',
        phoneCountryCode: user.phoneCountryCode || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      // Update user profile data
      await updateUser({
        id: userId,
        data: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          phoneCountryCode: formData.phoneCountryCode,
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const filteredDialCodes = countries?.filter(
    country =>
      country.name.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
      country.dial_code.includes(dialCodeSearch),
  );

  if (isUserLoading || isCountriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-md bg-white">
      <div className="flex items-center justify-between border-b-2 border-gray-200 py-6">
        <div>
          <h2 className="text-xl font-semibold">Profile</h2>
          <p className="text-sm text-gray-500">
            View and make changes to your profile
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          disabled={isUpdating}
          className="hover:bg-opacity-90 cursor-pointer rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all disabled:opacity-70"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="border-t border-gray-200 py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                disabled={!isEditing}
                className="h-11 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                disabled={true} // Email is read-only
                className="h-11 w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-4 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                disabled={!isEditing}
                className="h-11 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="flex">
                {/* Dial Code Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      isEditing &&
                      setShowDialCodeDropdown(!showDialCodeDropdown)
                    }
                    disabled={!isEditing}
                    className="flex h-11 cursor-pointer items-center rounded-l-md border border-gray-300 px-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:bg-gray-100 disabled:opacity-70"
                  >
                    <span className="mr-1">
                      {countries?.find(
                        c => c.dial_code === formData.phoneCountryCode,
                      )?.flag ||
                        countries?.[0]?.flag ||
                        '🇺🇸'}
                    </span>
                    <span>
                      {formData.phoneCountryCode || countries?.[0]?.dial_code}
                    </span>
                    {isEditing && (
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    )}
                  </button>

                  {showDialCodeDropdown && (
                    <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                      <div className="sticky top-0 bg-white p-2">
                        <input
                          type="text"
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          placeholder="Search country or code..."
                          value={dialCodeSearch}
                          onChange={e => setDialCodeSearch(e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      {filteredDialCodes?.map(country => (
                        <button
                          key={country.id}
                          type="button"
                          className="flex w-full cursor-pointer items-center px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              phoneCountryCode: country.dial_code,
                            }));
                            setShowDialCodeDropdown(false);
                            setDialCodeSearch('');
                          }}
                        >
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                          <span className="ml-auto text-gray-500">
                            {country.dial_code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={e => {
                    const value = e.target.value;
                    // Remove leading zero if present
                    const formattedValue = value.startsWith('0')
                      ? value.slice(1)
                      : value;
                    setFormData(prev => ({
                      ...prev,
                      phone: formattedValue,
                    }));
                  }}
                  placeholder="Phone Number"
                  disabled={!isEditing}
                  className="h-11 w-full rounded-r-md border border-l-0 border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="hover:bg-opacity-90 flex cursor-pointer items-center rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all disabled:opacity-70"
              >
                {isUpdating && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                )}
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
