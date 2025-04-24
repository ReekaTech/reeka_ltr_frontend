'use client';

import * as Yup from 'yup';

import { Form, Formik } from 'formik';

import { ExpenseCategory } from '@/services/api/schemas/expense';
import { Modal } from '@/components/ui/modal';
import { X } from 'lucide-react';
import { expenseValidationSchema } from '@/app/listings/validation';
import { useCreateExpense } from '@/services/queries/hooks/useExpense';
import { useEffect } from 'react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId?: string;
  propertyId?: string;
}

interface ExpenseFormData {
  name: string;
  category: ExpenseCategory;
  amount: string;
  date: string;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  portfolioId,
  propertyId,
}: AddExpenseModalProps) {
  const createExpenseMutation = useCreateExpense();

  const initialValues: ExpenseFormData = {
    name: '',
    category: ExpenseCategory.MAINTENANCE,
    amount: '',
    date: '',
  };

  const handleSubmit = async (values: ExpenseFormData) => {
    try {
      await createExpenseMutation.mutateAsync({
        ...(propertyId && { propertyId }),
        ...(portfolioId && { portfolioId }),
        name: values.name,
        category: values.category,
        amount: Number(values.amount),
        date: values.date,
      });
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
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

        <Formik
          initialValues={initialValues}
          validationSchema={expenseValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    required
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
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
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    required
                  >
                    {Object.values(ExpenseCategory).map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {touched.category && errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={values.amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                    required
                    min="0"
                    step="0.01"
                  />
                  {touched.amount && errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
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
                      value={values.date}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-200 py-2 pr-3 pl-10 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                      required
                      onFocus={(e) => (e.target.type = 'date')}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        handleBlur(e);
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
                  {touched.date && errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={createExpenseMutation.isPending}
                  className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-70"
                >
                  {createExpenseMutation.isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </div>
                  ) : (
                    'Add'
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
