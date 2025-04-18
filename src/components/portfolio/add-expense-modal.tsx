'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/components/ui';
import { X } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  portfolioName: string;
}

interface ExpenseFormData {
  name: string;
  category: string;
  amount: string;
  date: string;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  portfolioId,
  portfolioName,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: '',
    category: '',
    amount: '',
    date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category: '',
        amount: '',
        date: '',
      });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, you would send the data to your API
      console.log('Submitting expense:', {
        ...formData,
        portfolioId,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName="max-w-md w-full">
      <div className="relative">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-xl font-semibold">Expense</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <select
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
              >
                <option value="">Report Type</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Utilities">Utilities</option>
                <option value="Insurance">Insurance</option>
                <option value="Taxes">Taxes</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
              >
                <option value="">Property</option>
                <option value="Ama Nest">Ama Nest</option>
                <option value="Zest Housing">Zest Housing</option>
                <option value="Bancroft Housing">Bancroft Housing</option>
                <option value="Waterfield Estate">Waterfield Estate</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Amount
              </label>
              <select
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                required
              >
                <option value="">Monthly</option>
                <option value="fixed">Fixed Amount</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="date"
                  name="date"
                  placeholder="Choose Date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 py-2 pr-3 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  required
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
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </div>
              ) : (
                'Add'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
