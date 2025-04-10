'use client';

import type { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResendVerification() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would resend the verification email
    router.push('/verification-sent');
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Resend Verification */}
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
              Resend Verification
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Enter your email to receive a new verification link
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Submit button */}
              <div className="pt-5">
                <button
                  type="submit"
                  className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-3 text-white transition-all"
                >
                  Resend Verification
                </button>
              </div>

              <p className="pt-2 text-center text-sm text-[#475467]">
                Already verified?{' '}
                <Link href="/" className="text-[#e36b37]">
                  Sign In
                </Link>
              </p>
            </form>
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
