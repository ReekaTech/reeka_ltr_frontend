'use client';

import { getAllowedModules, hasModuleAccess } from '@/app/constants/roles';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  module: string;
  requiresAuth?: boolean;
}

/**
 * Custom hook for role-based navigation
 * Returns filtered navigation items based on user role
 */
export function useRoleNavigation(allNavItems: NavItem[]) {
  const { data: session, status } = useSession();

  const filteredNavItems = useMemo(() => {
    // Show loading state items during auth check
    if (status === 'loading') {
      return [];
    }

    // If not authenticated, return empty array
    if (!session?.user?.role) {
      return [];
    }

    const userRole = session.user.role;
    const allowedModules = getAllowedModules(userRole);

    // Filter navigation items based on user's allowed modules
    return allNavItems.filter(item => {
      // Allow items that don't require auth
      if (!item.requiresAuth) {
        return true;
      }

      // Check if user has access to this module
      return hasModuleAccess(userRole, item.module);
    });
  }, [allNavItems, session?.user?.role, status]);

  const userRole = session?.user?.role;
  const allowedModules = userRole ? getAllowedModules(userRole) : [];

  // Get the first allowed route for redirection
  const getFirstAllowedRoute = () => {
    if (!allowedModules.length) return '/auth/signin';
    
    const moduleRouteMap = {
      dashboard: '/dashboard',
      listings: '/listings',
      tenants: '/tenants',
      maintenance: '/maintenance',
      reports: '/reports',
      settings: '/settings',
    };

    const firstModule = allowedModules[0];
    return moduleRouteMap[firstModule as keyof typeof moduleRouteMap] || '/forbidden';
  };

  return {
    navItems: filteredNavItems,
    userRole,
    name: session?.user?.firstName || '',
    allowedModules,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    getFirstAllowedRoute,
    hasAccess: (module: string) => userRole ? hasModuleAccess(userRole, module) : false,
  };
}

/**
 * Hook to check if current user has access to specific modules
 */
export function useRoleAccess() {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const hasAccess = (module: string | string[]) => {
    if (!userRole) return false;
    
    if (Array.isArray(module)) {
      return module.some(m => hasModuleAccess(userRole, m));
    }
    
    return hasModuleAccess(userRole, module);
  };

  const getAllowed = () => {
    return userRole ? getAllowedModules(userRole) : [];
  };

  return {
    userRole,
    hasAccess,
    getAllowed,
    isAdmin: userRole === 'Admin',
    isPropertyManager: userRole === 'Property Manager',
    isAssociateManager: userRole === 'Associate Manager',
    isMaintenance: userRole === 'Maintenance',
  };
} 