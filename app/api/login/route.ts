import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getJWTSecret } from '@/lib/jwt';

export async function POST(request: Request) {
  const { password } = await request.json();

  // Remove all whitespace characters (spaces, newlines, tabs, etc.)
  const cleanPassword = password.replace(/\s+/g, '');

  if (cleanPassword === process.env.AUTH_PASSWORD) {
    // Generate signed JWT token
    const secret = getJWTSecret();
    const token = await new SignJWT({ authenticated: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')  // 7 days, matching maxAge
      .sign(secret);

    const response = NextResponse.json({ success: true });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600, // 7 days
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
}
