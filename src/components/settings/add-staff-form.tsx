'use client';

import { AlertCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';

import type React from 'react';
import { StaffFormSchema } from './schema/user';
import { UserInvitePayload } from '@/services/api/schemas/user';
import { UserRole } from '@/services/api/schemas';
import { useCountries } from '@/services/queries/hooks';
import { useInviteUser } from '@/services/queries/hooks/useUser';

// Validation schema

interface AddStaffFormProps {
  onBack: () => void;
}

export function AddStaffForm({ onBack }: AddStaffFormProps) {
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const { mutate: inviteUser, isPending: isInviting } = useInviteUser();

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [dialCodeSearch, setDialCodeSearch] = useState('');

  const filteredCountries = countries?.filter(
    country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.dial_code.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const filteredDialCodes = countries?.filter(
    country =>
      country.name.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
      country.dial_code.includes(dialCodeSearch),
  );

  if (isCountriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  const initialValues: UserInvitePayload = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    phoneCountryCode: countries?.[0]?.dial_code || '',
    country: countries?.[0]?.id || '',
    role: 'Admin',
  };

  const handleSubmit = (values: UserInvitePayload, { setSubmitting }: any) => {
    inviteUser(values, {
      onSuccess: () => {
        setSubmitting(false);
        onBack();
      },
      onError: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="bg-white">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex cursor-pointer items-center text-sm font-light text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Add staff</span>
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={StaffFormSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form className="mx-auto max-w-sm shadow-md">
            <div className="space-y-8">
              {/* Staff Details Section */}
              <div>
                <h2 className="font-nunito mb-4 flex h-12 items-center rounded-t-lg border-gray-200 bg-[#f6f6f6] pl-4 text-sm font-medium">
                  Staff Details
                </h2>
                <div className="space-y-4 rounded-t-lg px-4 py-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      First Name*
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    />
                    {errors.firstName && touched.firstName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Last Name*
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    />
                    {errors.lastName && touched.lastName && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    />
                    {errors.email && touched.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Phone No
                    </label>
                    <div className="flex">
                      {/* Dial Code Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          className="flex h-[39px] items-center rounded-l-md border border-gray-300 px-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          onClick={() =>
                            setShowDialCodeDropdown(!showDialCodeDropdown)
                          }
                        >
                          <span className="mr-1">
                            {countries?.find(
                              c => c.dial_code === values.phoneCountryCode,
                            )?.flag || '🇺🇸'}
                          </span>
                          <span>
                            {values.phoneCountryCode ||
                              countries?.[0]?.dial_code}
                          </span>
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </button>

                        {showDialCodeDropdown && (
                          <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                            <div className="sticky top-0 bg-white p-2">
                              <input
                                type="text"
                                className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                                placeholder="Search country or code..."
                                value={dialCodeSearch}
                                onChange={e =>
                                  setDialCodeSearch(e.target.value)
                                }
                                onClick={e => e.stopPropagation()}
                              />
                            </div>
                            {filteredDialCodes?.map(country => (
                              <button
                                key={country.id}
                                type="button"
                                className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                                onClick={() => {
                                  setFieldValue(
                                    'phoneCountryCode',
                                    country.dial_code,
                                  );
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
                      <Field
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Phone"
                        className="w-full rounded-r-md border border-l-0 border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value;
                          // Remove leading zero if present
                          const formattedValue = value.startsWith('0')
                            ? value.slice(1)
                            : value;
                          setFieldValue('phone', formattedValue);
                        }}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phone}
                      </p>
                    )}
                    {errors.phoneCountryCode && touched.phoneCountryCode && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.phoneCountryCode}
                      </p>
                    )}
                  </div>

                  {/* Country Dropdown */}
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        id="country"
                        className="flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-left text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
                      >
                        <span>
                          {countries?.find(c => c.id === values.country)
                            ?.name ||
                            countries?.[0]?.name ||
                            'Select a country'}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                          <div className="sticky top-0 bg-white p-2">
                            <input
                              type="text"
                              className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={e => setCountrySearch(e.target.value)}
                              onClick={e => e.stopPropagation()}
                            />
                          </div>
                          {filteredCountries?.map(country => (
                            <button
                              key={country.id}
                              type="button"
                              className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                setFieldValue('country', country.id);
                                setShowCountryDropdown(false);
                                setCountrySearch('');
                              }}
                            >
                              <span className="mr-2">{country.flag}</span>
                              <span>{country.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.country && touched.country && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.country}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-1 block text-xs font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        id="role"
                        name="role"
                        className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                      >
                        {Object.values(UserRole).map(role => (
                          <option key={role} value={role} className="text-sm">
                            {role}
                          </option>
                        ))}
                      </Field>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    {errors.role && touched.role && (
                      <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isInviting}
                className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:opacity-70"
              >
                {(isSubmitting || isInviting) && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                )}
                Add Staff
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
