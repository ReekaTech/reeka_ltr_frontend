'use client';

import { Layout } from '@/components/ui';
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
      <Layout>
        {/* Main content */}
        <div className="w-full flex-1">
          {/* Dashboard content */}
          <main className="h-screen w-full bg-amber-600 p-6"></main>
        </div>
      </Layout>
    </div>
  );
}
