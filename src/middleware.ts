import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { allowedRoles } from '@/app/constants/roles';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token?.user?.role || !allowedRoles.includes(token?.user?.role)) {
      return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', req.url));
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
