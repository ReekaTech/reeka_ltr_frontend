'use client';

import * as Yup from 'yup';

import { useEffect, useState } from 'react';
import { useOrganizationQuery, useUpdateTargetRevenueMutation } from '@/services/queries/hooks/useOrganization';

import type React from 'react';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';

// Password validation schema
const passwordSchema = Yup.object().shape({
  target: Yup.number().required('Target is required'),
});

export function RevenueSettings() {
  const { data: session } = useSession();
  const { data: targetRevenueData } = useOrganizationQuery(session?.user?.organizationId);
  const updateTargetRevenue = useUpdateTargetRevenueMutation();
  const { mutate, isPending } = updateTargetRevenue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const [formData, setFormData] = useState({
    target: targetRevenueData?.data?.targetRevenue ?? 0,
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, target: targetRevenueData?.data?.targetRevenue ?? 0 }));
  }, [targetRevenueData]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Remove currency formatting and convert to number
    const numericValue = Number(value.replace(/[^0-9]/g, ''));
    setFormData(prev => ({ ...prev, [name]: numericValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setFormData({
      target: 0,
    });
    setErrors({});
  };

  const validateForm = async () => {
    try {
      await passwordSchema.validate(formData, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        error.inner.forEach(err => {
          if (err.path) {
            validationErrors[err.path] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    if (!session?.user?.organizationId) {
      toast.error('Organization ID is required');
      return;
    }

    mutate(
      {
        organizationId: session.user.organizationId,
        data: {
          targetRevenue: formData.target,
        },
      },
      {
        onSuccess: () => {
          resetForm();
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-sm rounded-md bg-white">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Revenue Settings</h2>
        <p className="text-sm text-gray-500">Change your revenue settings here</p>
      </div>

      <div className="border-t border-gray-200 px-6 py-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                Revenue Target
              </label>
              <input
                type="text"
                id="target"
                name="target"
                value={formatCurrency(formData.target)}
                onChange={handleChange}
                placeholder="Target"
                className={`h-11 w-full rounded-md border text-xs ${
                  errors.target ? 'border-red-500' : 'border-gray-300'
                } px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none`}
              />
              {errors.target && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.target}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isPending}
              className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:opacity-70"
            >
              {isPending && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              )}
              Update Revenue Target
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
