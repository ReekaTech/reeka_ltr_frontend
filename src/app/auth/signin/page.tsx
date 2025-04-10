'use client';

import type { FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    // For now, we'll just simulate a successful login
    router.push('/dashboard'); // This would go to a dashboard page in the future
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Sign In */}
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
              Sign In
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Enter the correct details
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

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[15px] text-[#3a3a3a]"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full rounded-md border border-[#d0d5dd] bg-white px-4 py-3 focus:ring-2 focus:ring-[#e36b37]/50 focus:outline-none"
                  placeholder="Enter your password"
                  required
                />
                <div className="mt-2 text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#475467]"
                  >
                    Forget Password?
                  </Link>
                </div>
              </div>

              {/* Added more space before the button */}
              <div className="pt-5">
                <button
                  type="submit"
                  className="hover:bg-opacity-90 w-full rounded-md bg-[#e36b37] py-3 text-white transition-all"
                >
                  Sign In
                </button>
              </div>

              <p className="pt-2 text-center text-sm text-[#475467]">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-[#e36b37]">
                  Sign Up
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
