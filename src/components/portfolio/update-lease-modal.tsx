'use client';

import { AdditionalCharges, Lease } from '@/services/api/schemas/lease';
import { ChevronDown, Plus, Upload, X } from 'lucide-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import { leaseValidationSchema } from '@/app/listings/validation';
import { toast } from 'react-toastify';
import { uploadToS3 } from '@/services/api/upload';
import { useCountries } from '@/services/queries/hooks/useCountries';
import { useUpdateLease } from '@/services/queries/hooks/useLease';
import { useUploadSignedUrl } from '@/services/queries/hooks/useUploadSignedUrl';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UpdateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease;
}

interface ChargeInput {
  name: string;
  amount: number;
}

export function UpdateLeaseModal({
  isOpen,
  onClose,
  lease,
}: UpdateLeaseModalProps) {
  const { data: countries, isLoading: isCountriesLoading } = useCountries();
  const updateLeaseMutation = useUpdateLease();
  const uploadMutation = useUploadSignedUrl();
  const [showDialCodeDropdown, setShowDialCodeDropdown] = useState(false);
  const [dialCodeSearch, setDialCodeSearch] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState<ChargeInput[]>([]);
  const [leaseAgreementFile, setLeaseAgreementFile] = useState<File | null>(null);
  const [leaseAgreementUrl, setLeaseAgreementUrl] = useState<string>(lease.leaseAgreementUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDialCodes = countries?.filter(
    country =>
      country.name.toLowerCase().includes(dialCodeSearch.toLowerCase()) ||
      country.dial_code.includes(dialCodeSearch),
  );

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowDialCodeDropdown(false);
      setAdditionalCharges([]);
      setLeaseAgreementFile(null);
      setLeaseAgreementUrl(lease.leaseAgreementUrl || '');
    }
  }, [isOpen, lease.leaseAgreementUrl]);

  // Convert additionalCharges from Record to array format
  useEffect(() => {
    if (lease.additionalCharges) {
      const chargesArray = Object.entries(lease.additionalCharges).map(([name, amount]) => ({
        name,
        amount
      }));
      setAdditionalCharges(chargesArray);
    }
  }, [lease.additionalCharges]);

  const initialValues = {
    tenant: {
      firstName: lease.tenant?.firstName || '',
      lastName: lease.tenant?.lastName || '',
      email: lease.tenant?.email || '',
      currentAddress: lease.tenant?.currentAddress || '',
      gender: lease.tenant?.gender || '',
      phoneCountryCode: lease.tenant?.phoneCountryCode || '+234',
      phone: lease.tenant?.phone || '',
    },
    propertyId: lease.propertyId || '',
    startDate: lease.startDate,
    endDate: lease.endDate,
    rentalRate: lease.rentalRate.toString(),
    paymentFrequency: lease.paymentFrequency,
    notes: lease.notes || '',
  };

  const validateFileSize = (file: File): boolean => {
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File ${file.name} is too large. Maximum size is ${MAX_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFileSize(file)) return;

    setLeaseAgreementFile(file);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const { url, key } = await uploadMutation.mutateAsync({
        type: 'single',
        extension
      });

      await uploadToS3(url, file, key);
      const fileUrl = `https://lasser-assets.s3.eu-west-1.amazonaws.com/${key}`;
      setLeaseAgreementUrl(fileUrl);
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error('Failed to upload file');
      setLeaseAgreementFile(null);
    }
  };

  const handleAddCharge = () => {
    setAdditionalCharges([...additionalCharges, { name: '', amount: 0 }]);
  };

  const handleRemoveCharge = (index: number) => {
    setAdditionalCharges(additionalCharges.filter((_, i) => i !== index));
  };

  const handleChargeChange = (index: number, field: keyof ChargeInput, value: string | number) => {
    const newCharges = [...additionalCharges];
    newCharges[index] = {
      ...newCharges[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setAdditionalCharges(newCharges);
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formattedCharges: AdditionalCharges = additionalCharges.reduce((acc, charge) => ({
        ...acc,
        [charge.name]: charge.amount
      }), {});

      await updateLeaseMutation.mutateAsync({
        id: lease._id,
        data: {
          ...values,
          rentalRate: Number(values.rentalRate),
          leaseAgreementUrl,
          additionalCharges: formattedCharges
        }
      });
      onClose();
    } catch (error) {
      console.error('Failed to update lease:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lease"
      contentClassName="max-h-[90vh]"
    >
      <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
        <Formik
          initialValues={initialValues}
          validationSchema={leaseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="space-y-6">
                {/* Tenant Section */}
                <div>
                  <div className="mb-4 text-base font-medium">Tenant</div>

                  <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="mb-2 block text-sm">
                        First Name
                      </label>
                      <Field
                        id="firstName"
                        name="tenant.firstName"
                        type="text"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                      />
                      <ErrorMessage
                        name="tenant.firstName"
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
                        name="tenant.lastName"
                        type="text"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                      />
                      <ErrorMessage
                        name="tenant.lastName"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="tenant.email"
                        type="email"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                      />
                      <ErrorMessage
                        name="tenant.email"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    {/* Current Address */}
                    <div>
                      <label htmlFor="currentAddress" className="mb-2 block text-sm">
                        Current Address
                      </label>
                      <Field
                        id="currentAddress"
                        name="tenant.currentAddress"
                        type="text"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                      />
                      <ErrorMessage
                        name="tenant.currentAddress"
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
                          name="tenant.gender"
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
                        name="tenant.gender"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
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
                                c => c.dial_code === values.tenant.phoneCountryCode,
                              )?.flag || '🇳🇬'}
                            </span>
                            <span>{values.tenant.phoneCountryCode}</span>
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
                                    setFieldValue('tenant.phoneCountryCode', country.dial_code);
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
                          name="tenant.phone"
                          className="h-[42px] flex-1 rounded-r-md border border-l-0 border-[#e5e5e5] px-3 py-2.5"
                          placeholder="Enter Phone Number"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            // Remove leading zero if present
                            const formattedValue = value.startsWith('0')
                              ? value.slice(1)
                              : value;
                            setFieldValue('tenant.phone', formattedValue);
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="tenant.phone"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
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
                        <Field
                          type="text"
                          name="startDate"
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5 pl-10"
                          placeholder="Choose Date"
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                            ((e.target as HTMLInputElement).type = 'date')
                          }
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            if (!(e.target as HTMLInputElement).value) {
                              (e.target as HTMLInputElement).type = 'text';
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
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
                        <Field
                          type="text"
                          name="endDate"
                          className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5 pl-10"
                          placeholder="Choose Date"
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                            ((e.target as HTMLInputElement).type = 'date')
                          }
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            if (!(e.target as HTMLInputElement).value) {
                              (e.target as HTMLInputElement).type = 'text';
                            }
                          }}
                        />
                      </div>
                      <ErrorMessage
                        name="endDate"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
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
                        <Field
                          as="select"
                          id="paymentFrequency"
                          name="paymentFrequency"
                          className="w-full appearance-none rounded-md border border-[#e5e5e5] px-3 py-2.5 pe-10"
                        >
                          <option value="">Payment Frequency</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </Field>
                        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <ErrorMessage
                        name="paymentFrequency"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    {/* Rental Rate */}
                    <div>
                      <label htmlFor="rentalRate" className="mb-2 block text-sm">
                        Rental Rate
                      </label>
                      <Field
                        type="number"
                        id="rentalRate"
                        name="rentalRate"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                        placeholder="Rate"
                      />
                      <ErrorMessage
                        name="rentalRate"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="notes" className="mb-2 block text-sm">
                        Notes
                      </label>
                      <Field
                        as="textarea"
                        id="notes"
                        name="notes"
                        className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                        placeholder="Additional notes"
                      />
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="mt-1 text-sm text-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Lease Agreement Upload Section */}
                <div>
                  <div className="mb-4 text-base font-medium">Lease Agreement</div>
                  <div
                    className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6 text-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {leaseAgreementFile ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{leaseAgreementFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLeaseAgreementFile(null);
                            setLeaseAgreementUrl('');
                          }}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">Click here to upload lease agreement (PDF)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      aria-label="Upload lease agreement"
                    />
                  </div>
                </div>

                {/* Additional Charges Section */}
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-base font-medium">Additional Charges</div>
                    <button
                      type="button"
                      onClick={handleAddCharge}
                      className="flex items-center text-sm text-green-600"
                    >
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border border-green-600">
                        <Plus className="h-4 w-4" />
                      </div>
                      Add Charge
                    </button>
                  </div>

                  <div className="space-y-4">
                    {additionalCharges.map((charge, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={charge.name}
                            onChange={(e) => handleChargeChange(index, 'name', e.target.value)}
                            placeholder="Charge name"
                            className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={charge.amount}
                            onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                            placeholder="Amount"
                            className="w-full rounded-md border border-[#e5e5e5] px-3 py-2.5"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCharge(index)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#e36b37] px-4 py-2.5 text-white"
                  disabled={updateLeaseMutation.isPending}
                >
                  {updateLeaseMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Update Lease'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
} 