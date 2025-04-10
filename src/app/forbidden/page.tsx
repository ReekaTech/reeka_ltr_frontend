'use client';

import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center">
      <svg
        className="h-12 w-12 text-[#e36b37]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h10" />
        <path d="M7 12h10" />
        <path d="M7 17h10" />
        <path d="M3 3l18 18" />
      </svg>

      <h1 className="text-2xl font-semibold">Access Denied</h1>
      <p className="text-sm text-[#808080]">
        You don't have permission to access this resource
      </p>

      <Link
        href="/"
        className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 text-sm text-white"
      >
        Return Home
      </Link>
    </div>
  );
}
