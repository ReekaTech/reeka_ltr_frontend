'use client';

import { useEffect, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { useCountries } from '@/services/queries/hooks';

interface AddLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId?: string;
  propertyName?: string;
}

export function AddLeaseModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
}: AddLeaseModalProps) {
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    email: '',
    property: propertyName || '',
    phone: '',
    dial_code: '+234',
    age: '',
    address: '',
    startDate: '',
    endDate: '',
    paymentFrequency: '',
    rate: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dropdown states
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState('');

  const filteredDialCodes = countries?.filter(
    country =>
      country.name.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
      country.dial_code.includes(dialCodeSearch),
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowDialCodeDropdown(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lease"
      contentClassName="max-h-[90vh]"
    >
      <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Tenant Section */}
            <div>
              <div className="mb-4 text-base font-medium">Tenant</div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm">
                    Name
                  </label>
                  <div className="relative">
                    <select
                      id="name"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    >
                      <option value="">Report Type</option>
                      <option value="tenant1">Tenant 1</option>
                      <option value="tenant2">Tenant 2</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Sex */}
                <div>
                  <label htmlFor="sex" className="mb-2 block text-sm">
                    Sex
                  </label>
                  <div className="relative">
                    <select
                      id="sex"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.sex}
                      onChange={e =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                    >
                      <option value="">Report Type</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm">
                    Email
                  </label>
                  <div className="relative">
                    <select
                      id="email"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.property}
                      onChange={e =>
                        setFormData({ ...formData, property: e.target.value })
                      }
                    >
                      <option value="">Property</option>
                      <option value="property1">Property 1</option>
                      <option value="property2">Property 2</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm">
                    Phone Number
                  </label>
                  <div className="flex">
                    {/* Dial Code Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        className="flex h-[42px] items-center rounded-l-md border border-[#e5e5e5] bg-white px-2 focus:outline-none"
                        onClick={() =>
                          setShowDialCodeDropdown(!showDialCodeDropdown)
                        }
                      >
                        <span className="mr-1">
                          {countries?.find(
                            c => c.dial_code === formData.dial_code,
                          )?.flag || '🇳🇬'}
                        </span>
                        <span>{formData.dial_code}</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>

                      {showDialCodeDropdown && (
                        <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-[#e5e5e5] bg-white shadow-lg">
                          <div className="sticky top-0 bg-white p-2">
                            <input
                              type="text"
                              className="w-full rounded-md border border-[#e5e5e5] px-2 py-1 text-sm focus:outline-none"
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
                              className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-100"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  dial_code: country.dial_code,
                                });
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
                      className="flex-1 rounded-r-md border border-l-0 border-[#e5e5e5] px-3 py-2.5"
                      placeholder="Enter Phone Number"
                      value={formData.phone}
                      onChange={e => {
                        const value = e.target.value;
                        // Remove leading zero if present
                        const formattedValue = value.startsWith('0')
                          ? value.slice(1)
                          : value;
                        setFormData({ ...formData, phone: formattedValue });
                      }}
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="mb-2 block text-sm">
                    Age
                  </label>
                  <div className="relative">
                    <select
                      id="age"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.age}
                      onChange={e =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                    >
                      <option value="">Age</option>
                      <option value="18-24">18-24</option>
                      <option value="25-34">25-34</option>
                      <option value="35-44">35-44</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Current Address */}
                <div>
                  <label htmlFor="address" className="mb-2 block text-sm">
                    Current Address
                  </label>
                  <div className="relative">
                    <select
                      id="address"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.address}
                      onChange={e =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    >
                      <option value="">Address</option>
                      <option value="address1">Address 1</option>
                      <option value="address2">Address 2</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Date Section */}
            <div>
              <div className="mb-4 text-base font-medium">Date</div>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label htmlFor="startDate" className="mb-2 block text-sm">
                    Start Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.66667 4.00001V2.66667M11.3333 4.00001V2.66667M4 7.33334H12M2.66667 13.3333H13.3333C13.6869 13.3333 14.0261 13.1929 14.2761 12.9428C14.5262 12.6928 14.6667 12.3536 14.6667 12V4.66667C14.6667 4.31305 14.5262 3.97391 14.2761 3.72386C14.0261 3.47381 13.6869 3.33334 13.3333 3.33334H2.66667C2.31305 3.33334 1.97391 3.47381 1.72386 3.72386C1.47381 3.97391 1.33334 4.31305 1.33334 4.66667V12C1.33334 12.3536 1.47381 12.6928 1.72386 12.9428C1.97391 13.1929 2.31305 13.3333 2.66667 13.3333Z"
                          stroke="#999CA0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5 pl-10"
                      placeholder="Choose Date"
                      value={formData.startDate}
                      onChange={e =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      onFocus={e =>
                        ((e.target as HTMLInputElement).type = 'date')
                      }
                      onBlur={e => {
                        if (!(e.target as HTMLInputElement).value) {
                          (e.target as HTMLInputElement).type = 'text';
                        }
                      }}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label htmlFor="endDate" className="mb-2 block text-sm">
                    End Date
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.66667 4.00001V2.66667M11.3333 4.00001V2.66667M4 7.33334H12M2.66667 13.3333H13.3333C13.6869 13.3333 14.0261 13.1929 14.2761 12.9428C14.5262 12.6928 14.6667 12.3536 14.6667 12V4.66667C14.6667 4.31305 14.5262 3.97391 14.2761 3.72386C14.0261 3.47381 13.6869 3.33334 13.3333 3.33334H2.66667C2.31305 3.33334 1.97391 3.47381 1.72386 3.72386C1.47381 3.97391 1.33334 4.31305 1.33334 4.66667V12C1.33334 12.3536 1.47381 12.6928 1.72386 12.9428C1.97391 13.1929 2.31305 13.3333 2.66667 13.3333Z"
                          stroke="#999CA0"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5 pl-10"
                      placeholder="Choose Date"
                      value={formData.endDate}
                      onChange={e =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      onFocus={e =>
                        ((e.target as HTMLInputElement).type = 'date')
                      }
                      onBlur={e => {
                        if (!(e.target as HTMLInputElement).value) {
                          (e.target as HTMLInputElement).type = 'text';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rent Section */}
            <div>
              <div className="mb-4 text-base font-medium">Rent</div>

              <div className="space-y-4">
                {/* Rental Payment Frequency */}
                <div>
                  <label
                    htmlFor="paymentFrequency"
                    className="mb-2 block text-sm"
                  >
                    Rental Payment Frequency
                  </label>
                  <div className="relative">
                    <select
                      id="paymentFrequency"
                      className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                      value={formData.paymentFrequency}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          paymentFrequency: e.target.value,
                        })
                      }
                    >
                      <option value="">Payment Frequency</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Rental Rate */}
                <div>
                  <label htmlFor="rate" className="mb-2 block text-sm">
                    Rental Rate
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                    placeholder="Rate"
                    value={formData.rate}
                    onChange={e =>
                      setFormData({ ...formData, rate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-md bg-[#e36b37] px-4 py-2.5 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Add Lease'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
