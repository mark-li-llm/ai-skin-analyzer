import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { getJWTSecret } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
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

  // Get authentication token
  const authToken = request.cookies.get('auth-token');

  // No token - redirect to login
  if (!authToken?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify JWT token
  try {
    const secret = getJWTSecret();
    const { payload } = await jwtVerify(authToken.value, secret);

    // Check payload contains expected data
    if (payload.authenticated !== true) {
      // Invalid payload - redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Special handling for admin routes
    if (pathname.startsWith('/admin')) {
      // Check if user has admin role
      if (payload.role !== 'admin') {
        // User doesn't have admin role - redirect to login
        // This handles both missing role (old tokens) and user role
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    // Valid token and authorized for the route
    return NextResponse.next();

  } catch (error) {
    // Token verification failed (invalid signature, expired, malformed)
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: '/((?!_next/static|_next/image).*)',
};
