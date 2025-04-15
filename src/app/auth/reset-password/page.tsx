'use client';

import * as Yup from 'yup';

import { Field, Form, Formik } from 'formik';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import {
  useResendVerification,
  useResetPassword,
} from '@/services/queries/hooks';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { mutate: resetPassword, isPending } = useResetPassword();
  const { mutate: resendVerification, isPending: isResending } =
    useResendVerification();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Reset Password */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <Link href="/auth/signin">
              <h1 className="font-modak text-4xl text-[#e36b37] md:text-4xl">
                Reeka
              </h1>
            </Link>
          </div>
        </div>

        {/* Form with scrollable container and top padding for logo */}
        <div className="min-h-screen w-full overflow-y-auto bg-transparent px-6 pt-24 pb-12 sm:px-8 md:px-16 md:pt-32 lg:px-0">
          <div className="mx-auto w-full max-w-[360px] bg-transparent pt-6 lg:mx-0 lg:ml-[160px] lg:pt-12 xl:ml-[180px]">
            <h2 className="mb-2 text-[28px] font-semibold lg:text-[32px]">
              Reset Password
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Create a new password for your account
            </p>

            <Formik
              initialValues={{ password: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await resetPassword(
                    { token, password: values.password },
                    {
                      onSuccess: () => {
                        router.push('/auth/reset-password-success');
                      },
                    },
                  );
                } catch (error) {
                  console.error('Reset password error:', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-[15px] text-[#3a3a3a]"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs font-extrabold text-[#e36b37]"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <div className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </div>
                    )}
                    <div className="pt-2">
                      <Link
                        href="/auth/forgot-password"
                        className="flex w-full justify-end text-sm text-[#808080] hover:underline"
                      >
                        Resend Reset Link
                      </Link>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-5">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? 'Resetting...' : 'Reset Password'}
                    </button>
                  </div>

                  <p className="pt-2 text-center text-sm text-[#475467]">
                    Remember your password?{' '}
                    <Link href="/auth/signin" className="text-[#e36b37]">
                      Sign In
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Right side - Dashboard image */}
      <div className="relative hidden h-full min-h-screen overflow-hidden bg-transparent lg:block lg:w-1/2">
        <Image
          src="/dashboard-bg.png"
          alt="Reeka Dashboard Preview"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
