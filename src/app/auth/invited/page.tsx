import InvitationClient from './InvitationClient';
import { Suspense } from 'react';

function LoadingState() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Loading Skeleton */}
      <div className="relative w-full bg-transparent lg:w-1/2">
        {/* Fixed header with logo */}
        <div className="fixed top-0 right-0 left-0 z-20 flex h-24 items-center bg-transparent md:h-32 lg:absolute lg:right-auto lg:left-auto">
          <div className="ml-6 sm:ml-8 md:ml-16 lg:ml-[160px] xl:ml-[180px]">
            <div className="h-10 w-32 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>

        {/* Form with scrollable container and top padding for logo */}
        <div className="min-h-screen w-full overflow-y-auto bg-transparent px-6 pt-24 pb-12 sm:px-8 md:px-16 md:pt-32 lg:px-0">
          <div className="mx-auto w-full max-w-[360px] bg-transparent pt-6 lg:mx-0 lg:ml-[160px] lg:pt-12 xl:ml-[180px]">
            {/* Title skeleton */}
            <div className="mb-2 h-8 w-48 animate-pulse rounded-md bg-gray-200" />
            
            {/* Subtitle skeleton */}
            <div className="mb-6 h-4 w-64 animate-pulse rounded-md bg-gray-200" />

            {/* Content skeleton */}
            <div className="space-y-5">
              <div className="h-4 w-72 animate-pulse rounded-md bg-gray-200" />
              
              {/* Buttons skeleton */}
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="h-12 animate-pulse rounded-md bg-gray-200" />
                <div className="h-12 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Dashboard image skeleton */}
      <div className="relative hidden h-full min-h-screen overflow-hidden bg-transparent lg:block lg:w-1/2">
        <div className="h-full w-full animate-pulse bg-gray-200" />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <InvitationClient />
    </Suspense>
  );
}
