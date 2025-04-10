'use client';

import Link from 'next/link';

export default function ServerErrorPage() {
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
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>

      <h1 className="text-2xl font-semibold">Server Error</h1>
      <p className="text-sm text-[#808080]">
        Something went wrong on our end. Please try again later.
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
