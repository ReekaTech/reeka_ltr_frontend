'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-sm">
        <div className="flex h-16 items-center border-b border-[#e5e7eb] px-6">
          <Link href="/dashboard">
            <h1 className="font-modak text-3xl text-[#e36b37]">Reeka</h1>
          </Link>
        </div>
        <nav className="mt-6 space-y-1 px-4">
          <Link
            href="/dashboard"
            className="flex items-center rounded-lg px-4 py-3 text-[#4b5563] hover:bg-[#f3f4f6]"
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            href="/dashboard/properties"
            className="flex items-center rounded-lg px-4 py-3 text-[#4b5563] hover:bg-[#f3f4f6]"
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Properties
          </Link>
          <Link
            href="/dashboard/tenants"
            className="flex items-center rounded-lg px-4 py-3 text-[#4b5563] hover:bg-[#f3f4f6]"
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Tenants
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-6">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-[#111827]">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 hover:bg-[#f3f4f6]">
              <svg
                className="h-5 w-5 text-[#6b7280]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[#e36b37]"></div>
              <span className="text-sm font-medium text-[#4b5563]">
                {session?.user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats cards */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#6b7280]">
                  Total Properties
                </h3>
                <div className="rounded-full bg-[#e36b37]/10 p-2">
                  <svg
                    className="h-5 w-5 text-[#e36b37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-3xl font-semibold text-[#111827]">12</p>
              <p className="mt-2 text-sm text-[#6b7280]">
                <span className="text-[#10b981]">+2</span> from last month
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#6b7280]">
                  Active Tenants
                </h3>
                <div className="rounded-full bg-[#e36b37]/10 p-2">
                  <svg
                    className="h-5 w-5 text-[#e36b37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-3xl font-semibold text-[#111827]">24</p>
              <p className="mt-2 text-sm text-[#6b7280]">
                <span className="text-[#10b981]">+4</span> from last month
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-[#6b7280]">
                  Total Revenue
                </h3>
                <div className="rounded-full bg-[#e36b37]/10 p-2">
                  <svg
                    className="h-5 w-5 text-[#e36b37]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-3xl font-semibold text-[#111827]">
                $12,345
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                <span className="text-[#10b981]">+12%</span> from last month
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#111827]">
              Recent Activity
            </h3>
            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="divide-y divide-[#e5e7eb]">
                {[1, 2, 3, 4, 5].map(item => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 hover:bg-[#f9fafb]"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-[#e36b37]"></div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          New tenant added
                        </p>
                        <p className="text-sm text-[#6b7280]">2 hours ago</p>
                      </div>
                    </div>
                    <button className="rounded-md px-3 py-1 text-sm text-[#6b7280] hover:bg-[#f3f4f6]">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
