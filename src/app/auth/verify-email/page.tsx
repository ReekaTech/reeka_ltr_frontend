import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Loading */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <Link href="/auth/signin">
              <h1 className="font-modak text-3xl text-[#e36b37] md:text-4xl">
                Reeka
              </h1>
            </Link>
          </div>
        </div>

        {/* Content with scrollable container and top padding for logo */}
        <div className="min-h-screen w-full overflow-y-auto bg-transparent px-6 pt-24 pb-12 sm:px-8 md:px-16 md:pt-32 lg:px-0">
          <div className="mx-auto w-full max-w-[360px] bg-transparent pt-6 lg:mx-0 lg:ml-[160px] lg:pt-12 xl:ml-[180px]">
            {/* Icon skeleton */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
            </div>

            {/* Title skeleton */}
            <div className="mb-2 h-8 w-48 animate-pulse rounded-md bg-gray-200" />
            
            {/* Description skeleton */}
            <div className="mb-6 space-y-2">
              <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
              <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-200" />
            </div>

            {/* Button skeleton */}
            <div className="h-12 w-full animate-pulse rounded-md bg-gray-200" />
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

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerifyEmailClient />
    </Suspense>
  );
}
