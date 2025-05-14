import { ChevronDown, Plus, Upload, X } from 'lucide-react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { leaseValidationSchema, renewLeaseValidationSchema } from '@/app/listings/validation';
import { useEffect, useRef, useState } from 'react';

import { AdditionalCharges } from '@/services/api/schemas/lease';
import { Modal } from '@/components/ui/modal';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { uploadToS3 } from '@/services/api/upload';
import { useRenewLease } from '@/services/queries/hooks';
import { useUploadSignedUrl } from '@/services/queries/hooks/useUploadSignedUrl';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface RenewLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaseId: string;
  currentLease: {
    startDate: string;
    endDate: string;
    rentalRate: number;
    paymentFrequency: string;
    notes?: string;
    leaseAgreementUrl?: string;
    additionalCharges?: Record<string, number>;
    propertyId: string;
  };
}

interface ChargeInput {
  name: string;
  amount: number;
}

export function RenewLeaseModal({ isOpen, onClose, leaseId, currentLease }: RenewLeaseModalProps) {
  const renewLease = useRenewLease();
  const uploadMutation = useUploadSignedUrl();
  const [additionalCharges, setAdditionalCharges] = useState<ChargeInput[]>([]);
  const [leaseAgreementFile, setLeaseAgreementFile] = useState<File | null>(null);
  const [leaseAgreementUrl, setLeaseAgreementUrl] = useState<string>(currentLease.leaseAgreementUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAdditionalCharges([]);
      setLeaseAgreementFile(null);
      setLeaseAgreementUrl(currentLease.leaseAgreementUrl || '');
    }
  }, [isOpen, currentLease.leaseAgreementUrl]);

  const initialValues = {
    startDate: format(new Date(currentLease.startDate), 'yyyy-MM-dd'),
    endDate: '',
    rentalRate: currentLease.rentalRate.toString(),
    paymentFrequency: currentLease.paymentFrequency,
    notes: currentLease.notes || '',
    propertyId: currentLease.propertyId,
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

      await renewLease.mutateAsync({
        id: leaseId,
        data: {
          startDate: values.startDate,
          endDate: values.endDate,
          rentalRate: Number(values.rentalRate),
          paymentFrequency: values.paymentFrequency,
          notes: values.notes,
          propertyId: values.propertyId,
          leaseAgreementUrl,
          additionalCharges: formattedCharges
        }
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to renew lease:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renew Lease"
      contentClassName="max-h-[90vh]"
    >
      <div className="max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
        <Formik
          initialValues={initialValues}
          validationSchema={renewLeaseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form>
              <div className="space-y-6">
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
                  disabled={renewLease.isPending}
                >
                  {renewLease.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Renew Lease'
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