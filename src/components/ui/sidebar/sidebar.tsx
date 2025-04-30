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

import Link from 'next/link';
import type React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/#',
    icon: LayoutDashboard,
  },
  {
    title: 'Listing Management',
    href: '/listings',
    icon: Codesandbox,
  },
  {
    title: 'Tenants',
    href: '/tenants',
    icon: Calendar1,
  },
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: Drill,
  },
  {
    title: 'Report Center',
    href: '/#',
    icon: FileBarChart,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
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
  // const [isMobileOpen, setIsMobileOpen] = useState(true);
  // const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null);

  // Load collapsed state from localStorage on mount
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

  // Close mobile sidebar when route changes
  // useEffect(() => {
  //   setIsMobileOpen(false);
  // }, [pathname]);

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
              {/* <img
                src="/avatar.png"
                alt="User avatar"
                className="h-8 w-8 rounded-full"
              /> */}
              <h1 className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-gray-500 shadow-sm shadow-black">
                RW
              </h1>
              <div className="relative flex items-center">
                <button
                  // onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer text-gray-500"
                >
                  <ChevronsUpDown size={20} className="text-[#141B34]" />
                </button>
                {/* {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 w-40 origin-top-right rounded-md border border-gray-100 bg-white py-1 shadow-lg transition-all duration-200 ease-in-out">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                      Edit Profile
                    </button>
                  </div>
                )} */}
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
          {/* Logout button */}
          <div className="mt-auto border-t border-t-gray-100 px-4 py-3">
            <Link
              href="/auth/logout"
              className="flex items-center gap-2 text-[#6D6D6D] hover:text-gray-700"
            >
              <LogOut size={16} className="text-[#e36b37]" />
              {!isCollapsed && (
                <span className="font-sans text-xs font-medium text-[#141B34]">
                  Logout
                </span>
              )}
            </Link>
          </div>
        </nav>
      </TooltipProvider>
    </aside>
  );
}
