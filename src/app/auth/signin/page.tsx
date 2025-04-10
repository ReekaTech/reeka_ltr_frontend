'use client';

import * as Yup from 'yup';

import { Field, Form, Formik } from 'formik';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Sign In */}
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
              Sign In
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Enter your details to sign in
            </p>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const result = await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false,
                  });

                  if (result?.error) {
                    toast.error(result.error);
                    return;
                  }

                  if (result?.ok) {
                    toast.success('Signed in successfully');
                    router.push('/dashboard');
                  }
                } catch (error) {
                  console.error('Sign in error:', error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[15px] text-[#3a3a3a]"
                    >
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    {errors.email && touched.email && (
                      <div className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-[15px] text-[#3a3a3a]"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                        placeholder="Enter your password"
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
                    <div className="mt-2 flex justify-end">
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm text-[#808080] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  {/* Submit button */}
                  <div className="pt-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="hover:bg-opacity-90 w-full cursor-pointer rounded-md bg-[#e36b37] py-3 text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                  </div>

                  <p className="pt-2 text-center text-sm text-[#475467]">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="text-[#e36b37]">
                      Sign Up
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
