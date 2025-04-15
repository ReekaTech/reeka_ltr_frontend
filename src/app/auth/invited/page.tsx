'use client';

import * as Yup from 'yup';

import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRespondToInvitation } from '@/services/queries/hooks/useAuth';

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(8, 'Current password must be at least 8 characters')
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters')
    .required('New password is required'),
});

export default function InvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    mutate: respondToInvitation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useRespondToInvitation();

  // If no token is provided, redirect to home
  useEffect(() => {
    if (!token) {
      toast.error(
        'Invalid invitation link. Please contact your administrator.',
      );
      router.push('/');
    }
  }, [token, router]);

  // Redirect after successful response
  useEffect(() => {
    if (isSuccess) {
      router.push('/auth/signin');
    }
  }, [isSuccess, router]);

  const handleAccept = () => {
    setShowPasswordFields(true);
  };

  const handleReject = () => {
    if (!token) return;

    respondToInvitation({
      token,
      action: 'reject',
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Invitation Response */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <Link href="/">
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
              Staff Invitation
            </h2>

            {!showPasswordFields ? (
              <>
                <p className="mb-6 text-sm text-[#808080]">
                  You have been invited to join the platform
                </p>

                <div className="space-y-5">
                  <p className="text-[15px] text-[#3a3a3a]">
                    Would you like to accept or reject this invitation?
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <button
                      onClick={handleReject}
                      disabled={isPending}
                      className="rounded-md border border-[#d0d5dd] bg-white px-4 py-3 text-[15px] text-[#3a3a3a] hover:bg-gray-50 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={handleAccept}
                      disabled={isPending}
                      className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-3 text-[15px] text-white focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none disabled:opacity-50"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="mb-6 text-sm text-[#808080]">
                  Create a password to complete your registration
                </p>

                <Formik
                  initialValues={{ currentPassword: '', newPassword: '' }}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    if (!token) return;

                    respondToInvitation(
                      {
                        token,
                        action: 'accept',
                        currentPassword: values.currentPassword,
                        newPassword: values.newPassword,
                      },
                      {
                        onError: () => {
                          setSubmitting(false);
                        },
                        onSuccess: () => {
                          setSubmitting(false);
                        },
                      },
                    );
                  }}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-5">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="mb-2 block text-[15px] text-[#3a3a3a]"
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <Field
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs font-extrabold text-[#e36b37]"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? 'HIDE' : 'SHOW'}
                          </button>
                        </div>
                        {errors.currentPassword && touched.currentPassword && (
                          <div className="mt-1 text-sm text-red-500">
                            {errors.currentPassword}
                          </div>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="mb-2 block text-[15px] text-[#3a3a3a]"
                        >
                          New Password
                        </label>
                        <div className="relative">
                          <Field
                            id="newPassword"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                          />
                          <button
                            type="button"
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-xs font-extrabold text-[#e36b37]"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? 'HIDE' : 'SHOW'}
                          </button>
                        </div>
                        {errors.newPassword && touched.newPassword && (
                          <div className="mt-1 text-sm text-red-500">
                            {errors.newPassword}
                          </div>
                        )}
                      </div>

                      {/* Submit button */}
                      <div className="pt-5">
                        <button
                          type="submit"
                          disabled={isPending || isSubmitting}
                          className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isPending || isSubmitting
                            ? 'Processing...'
                            : 'Complete Registration'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </>
            )}
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
