'use client';

import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error & { digest?: string };
  reset?: () => void;
}) {
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
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>

      <h1 className="text-2xl font-semibold">Something went wrong!</h1>
      <p className="text-sm text-[#808080]">
        {error?.message || 'An unexpected error occurred'}
      </p>

      <div className="flex gap-4">
        {reset && (
          <button
            onClick={reset}
            className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 text-sm text-white"
          >
            Try again
          </button>
        )}
        <Link
          href="/"
          className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 text-sm text-white"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
