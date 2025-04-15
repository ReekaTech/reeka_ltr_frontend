'use client';

import * as Yup from 'yup';

import type React from 'react';
import { toast } from 'react-toastify';
import { useChangePassword } from '@/services/queries/hooks/useAuth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

// Password validation schema
const passwordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password'),
});

export function PasswordForm() {
  const { data: session } = useSession();
  const { mutate: changePassword, isPending } = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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

    changePassword(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
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
        <h2 className="text-xl font-semibold">Password</h2>
        <p className="text-sm text-gray-500">Change your password here</p>
      </div>

      <div className="border-t border-gray-200 px-6 py-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
                className={`h-11 w-full rounded-md border text-xs ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                } px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none`}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                className={`h-11 w-full rounded-md border text-xs ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                } px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none`}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                className={`h-11 w-full rounded-md border text-xs ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } px-4 py-2 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
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
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
