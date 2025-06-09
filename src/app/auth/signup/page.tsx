'use client';

import { Field, Form, Formik } from 'formik';
import { SignupFormValues, SignupSchema, getInitialValues } from './schema';

import Image from 'next/image';
import Link from 'next/link';
import { useCountries } from '@/services/queries/hooks';
import { useRouter } from 'next/navigation';
import { useSignup } from '@/services/queries/hooks/useAuth';
import { useState } from 'react';

export default function SignUp() {
  const router = useRouter();
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const { mutate: signup, isPending: isSigningUp } = useSignup();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [dialCodeSearch, setDialCodeSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (isCountriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  const handleSubmit = async (
    values: SignupFormValues,
    setSubmitting: (isSubmitting: boolean) => void,
    router: ReturnType<typeof useRouter>,
  ) => {
    try {
      const { dial_code, ...rest } = values;
      signup(
        {
          ...rest,
          phoneCountryCode: dial_code,
        },
        {
          onSuccess: () => {
            router.push('/auth/verification-sent');
          },
          onSettled: () => {
            setSubmitting(false);
          },
        },
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitting(false);
    }
  };

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

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Sign Up */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <Link href="/auth/signin">
              <h1 className="font-modak text-4xl text-[#e36b37] md:text-4xl">
                Reeka
              </h1>
            </Link>
          </div>
        </div>

        {/* Form with scrollable container and top padding for logo */}
        <div className="min-h-screen w-full overflow-y-auto bg-transparent px-6 pt-24 pb-12 sm:px-8 md:px-16 md:pt-32 lg:px-0">
          <div className="mx-auto w-full max-w-[360px] bg-transparent pt-6 lg:mx-0 lg:ml-[160px] lg:pt-12 xl:ml-[180px]">
            <h2 className="mb-2 text-[28px] font-semibold lg:text-[32px]">
              Sign Up
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Enter the correct details
            </p>

            <Formik<SignupFormValues>
              initialValues={getInitialValues(countries)}
              validationSchema={SignupSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, setSubmitting, router);
              }}
            >
              {({ errors, touched, values, setFieldValue }) => {
                return (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        First Name
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && touched.firstName && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.firstName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Last Name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && touched.lastName && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.lastName}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Email Address
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter your email"
                      />
                      {errors.email && touched.email && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    {/* Phone Number with Country Code */}
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Phone Number
                      </label>
                      <div className="flex">
                        {/* Dial Code Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            className="flex h-[50px] items-center rounded-l-md border border-[#d0d5dd] bg-white px-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                            onClick={() =>
                              setShowDialCodeDropdown(!showDialCodeDropdown)
                            }
                          >
                            <span className="mr-1">
                              {countries?.find(
                                c => c.dial_code === values.dial_code,
                              )?.flag || '🇺🇸'}
                            </span>
                            <span>
                              {values.dial_code || countries?.[0]?.dial_code}
                            </span>
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
                          </button>

                          {showDialCodeDropdown && (
                            <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-[#d0d5dd] bg-white shadow-lg">
                              <div className="sticky top-0 bg-white p-2">
                                <input
                                  type="text"
                                  className="w-full rounded-md border border-[#d0d5dd] px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
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
                                      'dial_code',
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
                          name="phoneNumber"
                          type="tel"
                          className="flex-1 rounded-r-md border border-l-0 border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          placeholder="Enter phone number"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
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
                        <div className="mt-1 text-sm text-red-500">
                          {errors.phone}
                        </div>
                      )}
                    </div>

                    {/* Country Dropdown */}
                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Country
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          id="country"
                          className="flex w-full items-center justify-between rounded-md border border-[#d0d5dd] bg-white px-4 py-3 text-left focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
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
                          <svg
                            className="h-5 w-5"
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
                        </button>

                        {showCountryDropdown && (
                          <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-[#d0d5dd] bg-white shadow-lg">
                            <div className="sticky top-0 bg-white p-2">
                              <input
                                type="text"
                                className="w-full rounded-md border border-[#d0d5dd] px-2 py-1 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
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
                                  setFieldValue('dial_code', country.dial_code);
                                  setShowCountryDropdown(false);
                                  setCountrySearch('');
                                }}
                              >
                                <span className="mr-2">{country.flag}</span>
                                <span>{country.name}</span>
                              </button>
                            ))}
                            {filteredCountries?.length === 0 && (
                              <div className="px-4 py-2 text-sm text-gray-500">
                                No countries found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.country && touched.country && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.country}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs font-extrabold text-[#e36b37]"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                      {errors.password && touched.password && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    {/* Company Name */}
                    <div>
                      <label
                        htmlFor="company"
                        className="mb-2 block text-[15px] text-[#3a3a3a]"
                      >
                        Company Name
                      </label>
                      <Field
                        name="company"
                        type="text"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter your company name"
                      />
                      {errors.company && touched.company && (
                        <div className="mt-1 text-sm text-red-500">
                          {errors.company}
                        </div>
                      )}
                    </div>

                    {/* Sign Up button */}
                    <div className="pt-5">
                      <button
                        type="submit"
                        disabled={isSigningUp}
                        className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSigningUp ? (
                          <div className="flex items-center justify-center">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Signing up...
                          </div>
                        ) : (
                          'Sign Up'
                        )}
                      </button>
                    </div>

                    <p className="pt-2 pb-8 text-center text-sm text-[#475467]">
                      Have an account?{' '}
                      <Link href="/auth/signin" className="text-[#e36b37]">
                        Sign In
                      </Link>
                    </p>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>

      {/* Right side - Higher quality dashboard image */}
      <div className="relative hidden h-full min-h-screen overflow-hidden bg-transparent lg:block lg:w-1/2">
        <Image
          src="/dashboard-bg.png"
          alt="Reeka Dashboard Preview"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
