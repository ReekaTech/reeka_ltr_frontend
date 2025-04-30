'use client';

import { ChevronDown, Upload, X } from 'lucide-react';
import { Form, Formik } from 'formik';
import { MaintenanceStatus, RequestType } from '@/services/api/schemas';

import { MAINTENANCE_TYPES } from '@/app/constants';
import { Modal } from '@/components/ui';
import { maintenanceValidationSchema } from '@/app/listings/validation';
import { uploadToS3 } from '@/services/api/upload';
import { useCreateMaintenanceTicket } from '@/services/queries/hooks';
import { useRef } from 'react';
import { useUploadSignedUrl } from '@/services/queries/hooks/useUploadSignedUrl';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string;
  propertyId?: string;
}

interface TicketFormData {
  title: string;
  description: string;
  propertyId: string;
  type: RequestType;
  priority: string;
  attachments: File[];
  attachmentPreviews: string[];
  status?: MaintenanceStatus;
}

const priorities = ['low', 'medium', 'high', 'urgent'];

export function AddTicketModal({
  isOpen,
  onClose,
  portfolioId,
  propertyId,
}: AddTicketModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createTicketMutation = useCreateMaintenanceTicket();
  const uploadMutation = useUploadSignedUrl();
  
  const initialValues: TicketFormData = {
    title: '',
    description: '',
    propertyId: propertyId || '',
    type: MAINTENANCE_TYPES[0].key as RequestType,
    priority: '',
    attachments: [],
    attachmentPreviews: [],
    status: 'open'
  };

  const handleSubmit = async (values: TicketFormData) => {
    try {
      // Group attachments by extension
      const groupedAttachments = values.attachments.reduce((acc, file) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension) return acc;
        
        if (!acc[extension]) {
          acc[extension] = [];
        }
        acc[extension].push(file);
        return acc;
      }, {} as Record<string, File[]>);

      // Upload attachments in batches by extension
      const attachmentUrls = await Promise.all(
        Object.entries(groupedAttachments).map(async ([extension, files]) => {
          // Get signed URL for this extension type
          const { url, key } = await uploadMutation.mutateAsync({
            type: 'single',
            extension
          });
          
          // Upload all files of this extension
          return Promise.all(
            files.map(async (file) => {
              await uploadToS3(url, file, key);
              return `https://lasser-assets.s3.eu-west-1.amazonaws.com/${key}`;
            })
          );
        })
      ).then(urls => urls.flat());

      await createTicketMutation.mutateAsync({
        ...(propertyId && { propertyId }),
        ...(portfolioId && { portfolioId }),
        title: values.title,
        description: values.description,
        type: values.type as RequestType,
        priority: values.priority,
        status: 'open' as MaintenanceStatus,
        attachments: attachmentUrls,
      });
      onClose();
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Maintenance Ticket"
      contentClassName="max-h-[80vh]"
    >
      <div className="max-h-[calc(80vh-120px)] overflow-y-auto pr-2">
        <Formik
          initialValues={initialValues}
          validationSchema={maintenanceValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
           
            const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (!files) return;

              const newFiles = Array.from(files);
              const updatedAttachments = [...values.attachments, ...newFiles];
              
              // Create preview URLs for new files
              const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
              const updatedPreviews = [...values.attachmentPreviews, ...newPreviewUrls];

              setFieldValue('attachments', updatedAttachments);
              setFieldValue('attachmentPreviews', updatedPreviews);
            };

            const handleRemoveAttachment = (index: number) => {
              const updatedAttachments = [...values.attachments];
              const updatedPreviews = [...values.attachmentPreviews];

              // Revoke the URL to avoid memory leaks
              URL.revokeObjectURL(updatedPreviews[index]);

              updatedAttachments.splice(index, 1);
              updatedPreviews.splice(index, 1);

              setFieldValue('attachments', updatedAttachments);
              setFieldValue('attachmentPreviews', updatedPreviews);
            };

            const handleDragOver = (e: React.DragEvent) => {
              e.preventDefault();
            };

            const handleDrop = (e: React.DragEvent) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (!files) return;

              const newFiles = Array.from(files);
              const updatedAttachments = [...values.attachments, ...newFiles];
              
              // Create preview URLs for new files
              const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
              const updatedPreviews = [...values.attachmentPreviews, ...newPreviewUrls];

              setFieldValue('attachments', updatedAttachments);
              setFieldValue('attachmentPreviews', updatedPreviews);
            };

            return (
              <Form className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Brief title of the issue"
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${
                      touched.title && errors.title
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#e36b37]'
                    }`}
                  />
                  {touched.title && errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="type"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Request Type
                  </label>
                  <div className="relative">
                    <select
                      id="type"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${
                        touched.type && errors.type
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#e36b37]'
                      }`}
                    >
                      {MAINTENANCE_TYPES.map(type => (
                        <option key={type.key} value={type.key}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  {touched.type && errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      id="priority"
                      name="priority"
                      value={values.priority}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${
                        touched.priority && errors.priority
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#e36b37]'
                      }`}
                    >
                      <option value="">Select priority</option>
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  {touched.priority && errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Describe the issue in detail"
                    rows={4}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${
                      touched.description && errors.description
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#e36b37]'
                    }`}
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Attachments
                  </label>
                  <div
                    className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 ${
                      touched.attachments && errors.attachments
                        ? 'border-red-300'
                        : 'border-gray-300'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <span className="relative cursor-pointer rounded-md bg-white font-medium text-[#e36b37] focus-within:outline-none">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      multiple
                      className="hidden"
                    />
                  </div>
                </div>

                {/* File preview */}
                {values.attachmentPreviews.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Attached files:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {values.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="group relative rounded-md border border-gray-200 bg-gray-50 p-2"
                        >
                          <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                              {file.type.startsWith('image/') ? (
                                <img
                                  src={values.attachmentPreviews[index]}
                                  alt={file.name}
                                  className="h-8 w-8 object-cover"
                                />
                              ) : (
                                <svg
                                  className="h-6 w-6 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="ml-3 flex-1 text-sm">
                              <p className="max-w-[120px] truncate font-medium text-gray-900">
                                {file.name}
                              </p>
                              <p className="text-gray-500">
                                {(file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="ml-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-[#e36b37] focus:outline-none"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || createTicketMutation.isPending}
                    className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-70"
                  >
                    {isSubmitting || createTicketMutation.isPending ? 'Adding...' : 'Add Ticket'}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
}
