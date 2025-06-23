'use client';

import {
  Calendar1,
  ChevronsUpDown,
  Codesandbox,
  Drill,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import { useRoleNavigation, type NavItem } from '@/hooks/use-role-navigation';

import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Define all navigation items with their required modules
const allNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
    requiresAuth: true,
  },
  {
    title: 'Listing Management',
    href: '/listings',
    icon: Codesandbox,
    module: 'listings',
    requiresAuth: true,
  },
  {
    title: 'Tenants',
    href: '/tenants',
    icon: Calendar1,
    module: 'tenants',
    requiresAuth: true,
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: Drill,
    module: 'maintenance',
    requiresAuth: true,
  },
  {
    title: 'Report Center',
    href: '/reports',
    icon: FileBarChart,
    module: 'reports',
    requiresAuth: true,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    module: 'settings',
    requiresAuth: true,
  },
];

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  // Get filtered navigation items based on user role
  const { navItems, isLoading, userRole, name } = useRoleNavigation(allNavItems);

  // Show loading skeleton while checking permissions
  if (isLoading) {
    return (
      <aside
        className={cn(
          'fixed top-0 left-0 z-[40] h-full border-r border-gray-100 bg-[#f6f6f6] transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[70px]' : 'w-[240px]',
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-gray-100 px-4">
          <div className="h-8 w-8 animate-pulse rounded bg-gray-300"></div>
        </div>
        <div className="px-3 py-4 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-gray-300"></div>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-[40] h-full border-r border-gray-100 bg-[#f6f6f6] transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[240px]',
      )}
    >
      {/* Logo and user section */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
        {!isCollapsed ? (
          <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-1.5 shadow-sm">
            {/* Logo in white rounded rectangle */}
            <h1 className="font-modak text-2xl text-[#e36b37]">Reeka</h1>

            {/* User profile with dropdown icon */}
            <div className="flex h-full items-center gap-2">
              <div className="flex flex-col items-end">
                <h1 className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-gray-500 shadow-sm shadow-black">
                  {name?.charAt(0) || 'U'}
                </h1>
                {userRole && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    {name.length > 8 ? name.substring(0, 8) + '...' : name}
                  </span>
                )}
              </div>
              <div className="relative flex items-center">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer text-gray-500"
                >
                  <ChevronsUpDown size={20} className="text-[#141B34]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Collapsed logo */}
            <div className="rounded-lg border border-gray-100 bg-white p-1.5 shadow-sm">
              <h1 className="font-modak text-3xl text-[#e36b37]">R</h1>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <TooltipProvider delayDuration={100}>
        <nav className="flex h-[calc(100%-4rem)] flex-col">
          <ul className="space-y-1 px-3 py-4">
            {navItems.map(item => {
              const isActive =
                pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <li key={item.title}>
                  <Tooltip open={isCollapsed && tooltipOpen === item.title}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onMouseEnter={() => setTooltipOpen(item.title)}
                        onMouseLeave={() => setTooltipOpen(null)}
                        className={cn(
                          'group flex items-center rounded-md px-3 py-2 transition-colors',
                          isActive
                            ? 'bg-white text-[#3A3A3A]'
                            : 'text-[#6D6D6D] hover:bg-white hover:text-gray-700',
                        )}
                      >
                        <Icon
                          size={20}
                          className={cn(
                            'shrink-0',
                            isActive
                              ? 'text-[#3A3A3A]'
                              : 'text-[#6D6D6D] group-hover:text-gray-700',
                          )}
                        />
                        {!isCollapsed && (
                          <span className="ml-3 text-xs font-medium">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent
                        side="right"
                        className="flex items-center"
                      >
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>

          {/* Logout button at the bottom */}
          <div className="mt-auto px-3 pb-4">
            <Tooltip open={isCollapsed && tooltipOpen === 'logout'}>
              <TooltipTrigger asChild>
                <button
                  onMouseEnter={() => setTooltipOpen('logout')}
                  onMouseLeave={() => setTooltipOpen(null)}
                  className="group flex w-full items-center rounded-md px-3 py-2 text-[#6D6D6D] transition-colors hover:bg-white hover:text-gray-700"
                  onClick={() => {
                    // Handle logout
                    window.location.href = '/auth/logout';
                  }}
                >
                  <LogOut
                    size={20}
                    className="shrink-0 text-[#6D6D6D] group-hover:text-gray-700"
                  />
                  {!isCollapsed && (
                    <span className="ml-3 text-xs font-medium">Logout</span>
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="flex items-center">
                  Logout
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
