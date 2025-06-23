'use client';

import { getAllowedModules } from '@/app/constants/roles';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    // Redirect to first allowed module based on user role
    const userRole = session.user.role;
    const allowedModules = getAllowedModules(userRole);
    const firstModule = allowedModules[0];
    console.log(firstModule);

    if (firstModule) {
      switch (firstModule) {
        case 'dashboard':
          router.push('/dashboard');
          break;
        case 'listings':
          router.push('/listings');
          break;
        case 'tenants':
          router.push('/tenants');
          break;
        case 'maintenance':
          router.push('/maintenance');
          break;
        case 'reports':
          router.push('/reports');
          break;
        case 'settings':
          router.push('/settings');
          break;
        default:
          router.push('/forbidden');
      }
    } else {
      router.push('/forbidden');
    }
  }, [session, status, router]);

  // Show loading spinner while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e36b37] border-t-transparent"></div>
    </div>
  );
}
