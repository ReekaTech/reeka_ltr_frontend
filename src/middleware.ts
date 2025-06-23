import { allowedRoles, getAllowedModules, hasRouteAccess } from '@/app/constants/roles';

import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const url = req.nextUrl.clone();

    // Check if user has valid role
    if (!token?.user?.role || !allowedRoles.includes(token?.user?.role)) {
      return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', req.url));
    }

    const userRole = token.user.role;
    const pathname = req.nextUrl.pathname;

    // Allow access to auth and error pages
    if (
      pathname.startsWith('/auth') ||
      pathname.startsWith('/forbidden') ||
      pathname.startsWith('/not-found') ||
      pathname.startsWith('/server-error') ||
      pathname.startsWith('/error')
    ) {
      return NextResponse.next();
    }

    // Check role-based access for protected routes
    if (!hasRouteAccess(userRole, pathname)) {
      // Redirect to first allowed module
      const allowedModules = getAllowedModules(userRole);
      const firstAllowedModule = allowedModules[0];
      
      let redirectPath = '/forbidden';
      
      if (firstAllowedModule) {
        switch (firstAllowedModule) {
          case 'dashboard':
            redirectPath = '/dashboard';
            break;
          case 'listings':
            redirectPath = '/listings';
            break;
          case 'tenants':
            redirectPath = '/tenants';
            break;
          case 'maintenance':
            redirectPath = '/maintenance';
            break;
          case 'reports':
            redirectPath = '/reports';
            break;
          case 'settings':
            redirectPath = '/settings';
            break;
        }
      }
      
      return NextResponse.redirect(new URL(redirectPath, req.url));
    }

    // Handle root route redirection based on role
    if (pathname === '/') {
      const allowedModules = getAllowedModules(userRole);
      const firstAllowedModule = allowedModules[0];
      
      if (firstAllowedModule === 'dashboard') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      } else if (firstAllowedModule === 'listings') {
        return NextResponse.redirect(new URL('/listings', req.url));
      } else if (firstAllowedModule === 'maintenance') {
        return NextResponse.redirect(new URL('/maintenance', req.url));
      } else if (firstAllowedModule === 'settings') {
        return NextResponse.redirect(new URL('/settings', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication pages)
     */
    '/((?!api|_next|favicon.ico|auth|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)',
  ],
};
