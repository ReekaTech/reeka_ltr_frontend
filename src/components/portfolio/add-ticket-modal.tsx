'use client';

import { useEffect, useState } from 'react';

import { ChevronDown } from 'lucide-react';
import { Modal } from '@/components/ui';

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string;
  portfolioName?: string;
}

interface TicketFormData {
  title: string;
  description: string;
  property: string;
  requestType: string;
  priority: string;
  assignedTo: string;
  dueDate: string;
  files: File[];
}

const requestTypes = [
  'Appliances',
  'Cleaning',
  'Electrical',
  'Gardening',
  'Light',
  'Plumbing',
  'Water',
  'Other',
];

const priorities = ['Low', 'Medium', 'High', 'Critical'];

export function AddTicketModal({
  isOpen,
  onClose,
  portfolioId,
  portfolioName,
}: AddTicketModalProps) {
  const [formData, setFormData] = useState<TicketFormData>({
    title: '',
    description: '',
    property: '',
    requestType: '',
    priority: '',
    assignedTo: '',
    dueDate: '',
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string[]>([]);

  // Sample properties data (would typically come from an API)
  const properties = [
    { id: '1', name: 'Ama Nest' },
    { id: '2', name: 'Zest Housing' },
    { id: '3', name: 'Bancroft Housing' },
    { id: '4', name: 'Waterfield Estate' },
  ];

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        description: '',
        property: '',
        requestType: '',
        priority: '',
        assignedTo: '',
        dueDate: '',
        files: [],
      });
      setFilePreview([]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));

      // Create preview URLs for new files
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFilePreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(filePreview[index]);
    setFilePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send the data to your API
      console.log('Submitting ticket:', {
        ...formData,
        portfolioId,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error adding ticket:', error);
    } finally {
      setIsSubmitting(false);
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
        <form
          id="add-ticket-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
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
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of the issue"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="property"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Property
            </label>
            <div className="relative">
              <select
                id="property"
                name="property"
                value={formData.property}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
              >
                <option value="">Select property</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="requestType"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Request Type
            </label>
            <div className="relative">
              <select
                id="requestType"
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
              >
                <option value="">Select request type</option>
                {requestTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
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
                value={formData.priority}
                onChange={handleChange}
                className="w-full appearance-none rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
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
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              rows={4}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="assignedTo"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter name or select from list"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <div className="relative">
              <input
                type="text"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                placeholder="Choose Date"
                className="w-full rounded-md border border-gray-200 px-3 py-2 pl-10 text-sm focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                onFocus={e => (e.target.type = 'date')}
                onBlur={e => {
                  if (!e.target.value) e.target.type = 'text';
                }}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-[#e36b37] focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, PDF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* File preview */}
          {filePreview.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Attached files:
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.files.map((file, index) => (
                  <div
                    key={index}
                    className="group relative rounded-md border border-gray-200 bg-gray-50 p-2"
                  >
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={filePreview[index]}
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
                        onClick={() => removeFile(index)}
                        className="ml-2 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-[#e36b37] focus:outline-none"
                      >
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add button inside the form */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                'Add Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
