'use client';

import Link from 'next/link';

export default function NotFoundPage() {
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
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>

      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-sm text-[#808080]">
        The page you're looking for doesn't exist.
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
