'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import Image from 'next/image';
// Country data with dial codes and flags
const countries = [
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', dialCode: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', dialCode: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', dialCode: '+49', flag: '🇩🇪' },
  { name: 'France', code: 'FR', dialCode: '+33', flag: '🇫🇷' },
  { name: 'Italy', code: 'IT', dialCode: '+39', flag: '🇮🇹' },
  { name: 'Spain', code: 'ES', dialCode: '+34', flag: '🇪🇸' },
  { name: 'Japan', code: 'JP', dialCode: '+81', flag: '🇯🇵' },
  { name: 'China', code: 'CN', dialCode: '+86', flag: '🇨🇳' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: '🇮🇳' },
  { name: 'Brazil', code: 'BR', dialCode: '+55', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', dialCode: '+52', flag: '🇲🇽' },
  { name: 'South Africa', code: 'ZA', dialCode: '+27', flag: '🇿🇦' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  // Add more countries as needed
];

export default function SignUp() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [selectedDialCode, setSelectedDialCode] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push('/success');
  };

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label
                  htmlFor="phone"
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
                      <span className="mr-1">{selectedDialCode.flag}</span>
                      <span>{selectedDialCode.dialCode}</span>
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
                        {countries.map(country => (
                          <button
                            key={country.code}
                            type="button"
                            className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                            onClick={() => {
                              setSelectedDialCode(country);
                              setShowDialCodeDropdown(false);
                            }}
                          >
                            <span className="mr-2">{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="ml-auto text-gray-500">
                              {country.dialCode}
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
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="flex-1 rounded-r-md border border-l-0 border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="propertyCount"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Property Count
                </label>
                <input
                  type="number"
                  id="propertyCount"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter property count"
                  required
                />
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
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  >
                    <span>{selectedCountry.name}</span>
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
                      {countries.map(country => (
                        <button
                          key={country.code}
                          type="button"
                          className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                        >
                          <span className="mr-2">{country.flag}</span>
                          <span>{country.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Sign Up button */}
              <div className="pt-5">
                <button
                  type="submit"
                  className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-3 text-white transition-all"
                >
                  Sign Up
                </button>
              </div>

              <p className="pt-2 pb-8 text-center text-sm text-[#475467]">
                Have an account?{' '}
                <Link href="/auth/signin" className="text-[#e36b37]">
                  Sign In
                </Link>
              </p>
            </form>
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
