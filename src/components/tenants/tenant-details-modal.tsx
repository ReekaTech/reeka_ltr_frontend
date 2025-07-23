'use client';

import * as Yup from 'yup';

import { ChevronDown, Edit, User, X } from 'lucide-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';

import { Lease } from '@/services/api/schemas';
import { Modal } from '@/components/ui/modal';
import { toast } from 'react-toastify';
import { useCountries } from '@/services/queries/hooks/useCountries';
import { useUpdateLease } from '@/services/queries/hooks/useLease';

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease | null;
  onSave?: (updatedLease: Partial<Lease>) => void;
}

const tenantValidationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  phoneCountryCode: Yup.string().required('Country code is required'),
  address: Yup.string(),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender'),
});

export function TenantDetailsModal({
  isOpen,
  onClose,
  lease,
  onSave
}: TenantDetailsModalProps) {
  const { data: countries } = useCountries();
  const updateLeaseMutation = useUpdateLease();
  const [isEditing, setIsEditing] = useState(false);
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState('');
  const dialCodeDropdownRef = useRef<HTMLDivElement>(null);

  const filteredDialCodes = countries?.filter(
    country =>
      country.name.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
      country.dial_code.includes(dialCodeSearch),
  );

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setShowDialCodeDropdown(false);
      setDialCodeSearch('');
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialCodeDropdownRef.current && !dialCodeDropdownRef.current.contains(event.target as Node)) {
        setShowDialCodeDropdown(false);
      }
    }

    if (showDialCodeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDialCodeDropdown]);

  if (!lease?.tenant) return null;

  const tenant = lease.tenant;

  const initialValues = {
    firstName: tenant.firstName || '',
    lastName: tenant.lastName || '',
    email: tenant.email || '',
    phone: tenant.phone || '',
    phoneCountryCode: (tenant as any).phoneCountryCode || '+234',
    address: (tenant as any).address || '',
    gender: tenant.gender || '',
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await updateLeaseMutation.mutateAsync({
        id: lease._id,
        data: {
          tenant: {
            ...values,
            id: tenant._id
          }
        } as any
      });
      setIsEditing(false);
      if (onSave) {
        onSave(lease);
      }
    } catch (error) {
      console.error('Failed to update tenant:', error);
      toast.error('Failed to update tenant details');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tenant Details"
      contentClassName="max-h-[90vh] max-w-2xl"
    >
      <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
        <Formik
          initialValues={initialValues}
          validationSchema={tenantValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, dirty }) => (
            <Form>
              <div className="space-y-6">
                {/* Header with Edit Toggle */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tenant.firstName} {tenant.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{tenant.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {/* Personal Information */}
                <div>
                  <div className="mb-4 text-base font-medium">Personal Information</div>
                  
                  {!isEditing ? (
                    // View Mode - Card Layout
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            First Name
                          </label>
                          <p className="text-sm font-medium text-gray-900">{values.firstName}</p>
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Last Name
                          </label>
                          <p className="text-sm font-medium text-gray-900">{values.lastName}</p>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Email Address
                          </label>
                          <p className="text-sm font-medium text-gray-900">{values.email}</p>
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Gender
                          </label>
                          <p className="text-sm font-medium text-gray-900 capitalize">{values.gender || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode - Form Layout
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* First Name */}
                      <div>
                        <label htmlFor="firstName" className="mb-2 block text-sm">
                          First Name
                        </label>
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label htmlFor="lastName" className="mb-2 block text-sm">
                          Last Name
                        </label>
                        <Field
                          id="lastName"
                          name="lastName"
                          type="text"
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm">
                          Email Address
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor="gender" className="mb-2 block text-sm">
                          Gender
                        </label>
                        <div className="relative">
                          <Field
                            as="select"
                            id="gender"
                            name="gender"
                            className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div>
                  <div className="mb-4 text-base font-medium">Contact Information</div>
                  
                  {!isEditing ? (
                    // View Mode - Card Layout
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Phone Number */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Phone Number
                          </label>
                          <p className="text-sm font-medium text-gray-900">
                            {values.phoneCountryCode} {values.phone}
                          </p>
                        </div>

                        {/* Address */}
                        <div>
                          <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Address
                          </label>
                          <p className="text-sm font-medium text-gray-900">{values.address || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Edit Mode - Form Layout
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone Number */}
                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm">
                          Phone Number
                        </label>
                        <div className="flex">
                          {/* Dial Code Dropdown */}
                          <div className="relative" ref={dialCodeDropdownRef}>
                            <button
                              type="button"
                              className="flex h-[42px] items-center rounded-l-md border border-r-0 border-[#e5e5e5] bg-gray-50 px-3 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDialCodeDropdown(!showDialCodeDropdown)}
                            >
                              <span className="mr-1">
                                {countries?.find(c => c.dial_code === values.phoneCountryCode)?.flag || '🇳🇬'}
                              </span>
                              <span>{values.phoneCountryCode}</span>
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {showDialCodeDropdown && (
                              <div className="absolute z-10 mt-1 max-h-60 w-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                                <div className="sticky top-0 bg-white p-2">
                                  <input
                                    type="text"
                                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                                    placeholder="Search country..."
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
                                      setFieldValue('phoneCountryCode', country.dial_code);
                                      setShowDialCodeDropdown(false);
                                      setDialCodeSearch('');
                                    }}
                                  >
                                    <span className="mr-2">{country.flag}</span>
                                    <span className="text-sm">{country.name}</span>
                                    <span className="ml-auto text-sm text-gray-500">
                                      {country.dial_code}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <Field
                            type="tel"
                            name="phone"
                            className="h-[42px] flex-1 rounded-r-md border border-[#e5e5e5] px-3 py-2.5"
                            placeholder="Enter phone number"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const value = e.target.value;
                              const formattedValue = value.startsWith('0') ? value.slice(1) : value;
                              setFieldValue('phone', formattedValue);
                            }}
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label htmlFor="address" className="mb-2 block text-sm">
                          Address
                        </label>
                        <Field
                          as="textarea"
                          id="address"
                          name="address"
                          rows={3}
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                          placeholder="Enter address"
                        />
                        <ErrorMessage
                          name="address"
                          component="div"
                          className="mt-1 text-sm text-red-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Lease Information */}
                <div>
                  <div className="mb-4 text-base font-medium">Lease Information</div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Property
                        </label>
                        <p className="text-sm font-medium text-gray-900">{lease.property?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Lease Status
                        </label>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lease.status === 'active'
                              ? 'bg-green-100 text-green-800' 
                              : lease.status === 'terminated'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lease.status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Rental Rate
                        </label>
                        <p className="text-sm font-medium text-gray-900">₦{lease.rentalRate?.toLocaleString() || '0'}</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Payment Status
                        </label>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lease.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {lease.paymentStatus || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!dirty || updateLeaseMutation.isPending}
                      className="px-4 py-2 text-sm font-medium text-white bg-[#e36b37] border border-transparent rounded-md hover:bg-[#d55a2f] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updateLeaseMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
} 