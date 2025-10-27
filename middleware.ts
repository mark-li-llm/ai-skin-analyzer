import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  if (
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname === '/api/login'
  ) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const authToken = request.cookies.get('auth-token');

  if (authToken?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: '/((?!_next/static|_next/image).*)',
};
