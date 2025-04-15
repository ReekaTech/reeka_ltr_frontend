'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import type React from 'react';
import { Sidebar } from '@/components/ui';
import { cn } from '@/lib/utils';

export function Layout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }

    // Set collapsed state on mobile
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1">
        <div
          className={cn(
            'fixed top-0 z-[50] flex h-28 w-full items-center border-b border-gray-100 bg-white px-6 transition-all duration-300 ease-in-out',
            isCollapsed
              ? 'left-[70px] w-[calc(100%-70px)]'
              : 'left-[240px] w-[calc(100%-240px)]',
          )}
        >
          <div className="flex w-full flex-col gap-y-2">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
              style={{ borderRadius: '50%' }}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ArrowRight size={16} className="text-gray-600" />
              ) : (
                <ArrowLeft size={16} className="text-gray-600" />
              )}
            </button>
            {title && (
              <p className="text-nunito text-xl font-bold text-gray-600">
                {title}
              </p>
            )}
            {description && (
              <p className="text-sm font-extralight text-gray-600">
                {description}
              </p>
            )}
          </div>
        </div>
        <main
          className={cn(
            'fixed top-24 bottom-0 overflow-y-auto transition-all duration-300 ease-in-out',
            isCollapsed
              ? 'left-[70px] w-[calc(100%-70px)]'
              : 'left-[240px] w-[calc(100%-240px)]',
          )}
        >
          <div className="h-full w-full bg-white px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
