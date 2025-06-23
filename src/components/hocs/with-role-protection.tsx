'use client';

import { getAllowedModules, hasRouteAccess } from '@/app/constants/roles';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface WithRoleProtectionProps {
  children: React.ReactNode;
  requiredModule?: string;
  fallbackPath?: string;
  showFallback?: boolean;
}

/**
 * Higher-order component that provides role-based access control
 * @param requiredModule - Specific module required to access the component
 * @param fallbackPath - Path to redirect to if access is denied (default: first allowed module)
 * @param showFallback - Whether to show a fallback UI instead of redirecting
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config?: {
    requiredModule?: string;
    fallbackPath?: string;
    showFallback?: boolean;
  }
) {
  return function ProtectedComponent(props: P) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const [redirectPath, setRedirectPath] = useState<string>('');

    useEffect(() => {
      if (status === 'loading') return;

      if (!session?.user?.role) {
        setIsAuthorized(false);
        setRedirectPath('/auth/signin');
        return;
      }

      const userRole = session.user.role;

      // Check specific module access if required
      if (config?.requiredModule) {
        const allowedModules = getAllowedModules(userRole);
        const hasAccess = allowedModules.includes(config.requiredModule);
        setIsAuthorized(hasAccess);
        
        if (!hasAccess) {
          // Redirect to first allowed module or fallback path
          const firstAllowedModule = allowedModules[0];
          const fallback = config?.fallbackPath || 
            (firstAllowedModule === 'dashboard' ? '/dashboard' : 
             firstAllowedModule === 'listings' ? '/listings' :
             firstAllowedModule === 'tenants' ? '/tenants' :
             firstAllowedModule === 'maintenance' ? '/maintenance' :
             firstAllowedModule === 'settings' ? '/settings' : '/forbidden');
          setRedirectPath(fallback);
        }
        return;
      }

      // Check route access
      const hasAccess = hasRouteAccess(userRole, pathname);
      setIsAuthorized(hasAccess);

      if (!hasAccess) {
        // Redirect to first allowed module
        const allowedModules = getAllowedModules(userRole);
        const firstAllowedModule = allowedModules[0];
        const fallback = config?.fallbackPath || 
          (firstAllowedModule === 'dashboard' ? '/dashboard' : 
           firstAllowedModule === 'listings' ? '/listings' :
           firstAllowedModule === 'tenants' ? '/tenants' :
           firstAllowedModule === 'maintenance' ? '/maintenance' :
           firstAllowedModule === 'settings' ? '/settings' : '/forbidden');
        setRedirectPath(fallback);
      }
    }, [session, status, pathname, config?.requiredModule, config?.fallbackPath]);

    // Loading state
    if (status === 'loading' || isAuthorized === null) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
        </div>
      );
    }

    // Unauthorized access
    if (!isAuthorized) {
      if (config?.showFallback) {
        return <AccessDeniedFallback redirectPath={redirectPath} />;
      }

      // Redirect
      if (typeof window !== 'undefined' && redirectPath) {
        window.location.href = redirectPath;
      }
      return null;
    }

    // Authorized access
    return <WrappedComponent {...props} />;
  };
}

/**
 * Standalone component for role-based protection
 */
export function RoleProtection({ 
  children, 
  requiredModule, 
  fallbackPath, 
  showFallback = false 
}: WithRoleProtectionProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [redirectPath, setRedirectPath] = useState<string>('');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.role) {
      setIsAuthorized(false);
      setRedirectPath('/auth/signin');
      return;
    }

    const userRole = session.user.role;

    // Check specific module access if required
    if (requiredModule) {
      const allowedModules = getAllowedModules(userRole);
      const hasAccess = allowedModules.includes(requiredModule);
      setIsAuthorized(hasAccess);
      
      if (!hasAccess) {
        const firstAllowedModule = allowedModules[0];
        const fallback = fallbackPath || 
          (firstAllowedModule === 'dashboard' ? '/dashboard' : 
           firstAllowedModule === 'listings' ? '/listings' :
           firstAllowedModule === 'tenants' ? '/tenants' :
           firstAllowedModule === 'maintenance' ? '/maintenance' :
           firstAllowedModule === 'settings' ? '/settings' : '/forbidden');
        setRedirectPath(fallback);
      }
      return;
    }

    // Check route access
    const hasAccess = hasRouteAccess(userRole, pathname);
    setIsAuthorized(hasAccess);

    if (!hasAccess) {
      const allowedModules = getAllowedModules(userRole);
      const firstAllowedModule = allowedModules[0];
      const fallback = fallbackPath || 
        (firstAllowedModule === 'dashboard' ? '/dashboard' : 
         firstAllowedModule === 'listings' ? '/listings' :
         firstAllowedModule === 'tenants' ? '/tenants' :
         firstAllowedModule === 'maintenance' ? '/maintenance' :
         firstAllowedModule === 'settings' ? '/settings' : '/forbidden');
      setRedirectPath(fallback);
    }
  }, [session, status, pathname, requiredModule, fallbackPath]);

  // Loading state
  if (status === 'loading' || isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#e36b37]"></div>
      </div>
    );
  }

  // Unauthorized access
  if (!isAuthorized) {
    if (showFallback) {
      return <AccessDeniedFallback redirectPath={redirectPath} />;
    }

    // Redirect
    if (typeof window !== 'undefined' && redirectPath) {
      window.location.href = redirectPath;
    }
    return null;
  }

  return <>{children}</>;
}

/**
 * Access denied fallback component
 */
function AccessDeniedFallback({ redirectPath }: { redirectPath: string }) {
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
        You don't have permission to access this module
      </p>

      <Link
        href={redirectPath}
        className="hover:bg-opacity-90 rounded-md bg-[#e36b37] px-4 py-2 text-sm text-white"
      >
        Go to Allowed Section
      </Link>
    </div>
  );
} 