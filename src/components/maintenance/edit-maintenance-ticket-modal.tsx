'use client';

import { ChevronDown, Upload, X } from 'lucide-react';
import { Form, Formik } from 'formik';
import { MaintenanceStatus, MaintenanceTicket, RequestType } from '@/services/api/schemas/maintenance';

import { MAINTENANCE_TYPES } from '@/app/constants';
import { Modal } from '@/components/ui';
import { maintenanceValidationSchema } from '@/app/listings/validation';
import { uploadMaintenanceAttachments } from '@/services/api/upload';
import { useRef } from 'react';
import { useUpdateMaintenanceTicket } from '@/services/queries/hooks/useMaintenance';

interface EditMaintenanceTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: MaintenanceTicket | null;
}

interface TicketFormData {
  title: string;
  description: string;
  category: RequestType;
  priority: string;
  status: MaintenanceStatus;
  attachments: File[];
  attachmentPreviews: string[];
  existingAttachments: string[];
}

const priorities = ['low', 'medium', 'high', 'urgent'];

export function EditMaintenanceTicketModal({
  isOpen,
  onClose,
  ticket,
}: EditMaintenanceTicketModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateTicketMutation = useUpdateMaintenanceTicket();

  if (!ticket) return null;

  const initialValues: TicketFormData = {
    title: ticket.title || '',
    description: ticket.description || '',
    category: ticket.category,
    priority: ticket.priority || '',
    status: ticket.status,
    attachments: [],
    attachmentPreviews: [],
    existingAttachments: ticket.attachments || [],
  };

  const handleSubmit = async (values: TicketFormData) => {
    try {
      const newAttachmentUrls = values.attachments.length
        ? await uploadMaintenanceAttachments(values.attachments)
        : [];

      // Combine existing and new attachments
      const allAttachments = [...values.existingAttachments, ...newAttachmentUrls];

      await updateTicketMutation.mutateAsync({
        id: ticket._id,
        data: {
          title: values.title,
          description: values.description,
          category: values.category,
          priority: values.priority,
          status: values.status,
          attachments: allAttachments,
        }
      });
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Maintenance Ticket"
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

            const handleRemoveExistingAttachment = (index: number) => {
              const updatedExistingAttachments = [...values.existingAttachments];
              updatedExistingAttachments.splice(index, 1);
              setFieldValue('existingAttachments', updatedExistingAttachments);
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
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${touched.title && errors.title
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
                      id="category"
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${touched.category && errors.category
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
                  {touched.category && errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
                      className={`w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${touched.priority && errors.priority
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#e36b37]'
                        }`}
                    >
                      <option value="">Select priority</option>
                      {priorities.map(priority => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <div className="relative">
                    <select
                      id="status"
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full appearance-none rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${touched.status && errors.status
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#e36b37]'
                        }`}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  {touched.status && errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status}</p>
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
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none ${touched.description && errors.description
                      ? 'border-red-300 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#e36b37]'
                      }`}
                  />
                  {touched.description && errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Existing Attachments */}
                {values.existingAttachments.length > 0 && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Current Attachments
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {values.existingAttachments.map((attachment, index) => {
                        const fileName = attachment.split('/').pop() || 'attachment';
                        return (
                          <div
                            key={index}
                            className="group relative rounded-md border border-gray-200 bg-gray-50 p-2"
                          >
                            <div className="flex items-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
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
                              </div>
                              <div className="ml-3 flex-1 text-sm">
                                <p className="max-w-[120px] truncate font-medium text-gray-900">
                                  {fileName}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveExistingAttachment(index)}
                                className="ml-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-[#e36b37] focus:outline-none"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Add New Attachments
                  </label>
                  <div
                    className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6 ${touched.attachments && errors.attachments
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

                {/* New File preview */}
                {values.attachmentPreviews.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      New files to upload:
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
                    disabled={isSubmitting || updateTicketMutation.isPending}
                    className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-70"
                  >
                    {isSubmitting || updateTicketMutation.isPending ? 'Updating...' : 'Update Ticket'}
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