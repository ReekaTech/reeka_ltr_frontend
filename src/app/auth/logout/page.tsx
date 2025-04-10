'use client';

import { signOut, useSession } from 'next-auth/react';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useLogout } from '@/services/queries/useAuth';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();
  const { status } = useSession();
  const { mutate: logout, isPending } = useLogout();

  useEffect(() => {
    if (status === 'authenticated') {
      logout(undefined, {
        onSuccess: () => {
          signOut({ redirect: false }).then(() => {
            router.push('/auth/signin');
          });
        },
        onError: () => {
          // Even if the API call fails, we still want to sign out locally
          signOut({ redirect: false }).then(() => {
            router.push('/auth/signin');
          });
        },
      });
    } else {
      router.push('/auth/signin');
    }
  }, [status, router, logout]);

  return (
    <div className="flex min-h-screen flex-col bg-transparent lg:flex-row">
      {/* Left side - Logout */}
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
            {/* Logout icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
                  fill="#219653"
                />
              </svg>
            </div>

            <h2 className="mb-2 text-[28px] font-semibold lg:text-[32px]">
              Logging Out
            </h2>
            <p className="mb-6 text-sm text-[#808080]">
              Please wait while we log you out...
            </p>
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
