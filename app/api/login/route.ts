import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getJWTSecret } from '@/lib/jwt';
import { getRedisClient } from '@/lib/logging';

// Rate limiting function using Redis
async function checkRateLimit(ip: string): Promise<boolean> {
  const client = getRedisClient();
  const key = `login-attempts:${ip}`;

  try {
    const attempts = await client.incr(key);

    if (attempts === 1) {
      // First attempt, set 5-minute expiry
      await client.expire(key, 300);
    }

    if (attempts > 5) {
      return false; // Too many attempts
    }

    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Fail open if Redis is down
  }
}

export async function POST(request: Request) {
  // Get IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Check rate limit
  if (!await checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Try again in 5 minutes.' },
      { status: 429 }
    );
  }

  const { password } = await request.json();

  // Remove all whitespace characters (spaces, newlines, tabs, etc.)
  const cleanPassword = password.replace(/\s+/g, '');

  // Check both passwords and assign appropriate role
  const appPassword = process.env.AUTH_PASSWORD;
  const adminPassword = process.env.ADMIN_PASSWORD;

  let role: 'admin' | 'user' | null = null;

  if (cleanPassword === adminPassword) {
    role = 'admin';
  } else if (cleanPassword === appPassword) {
    role = 'user';
  }

  if (role) {
    // Generate signed JWT token with role
    const secret = getJWTSecret();
    const token = await new SignJWT({
      authenticated: true,
      role: role,
      iat: Math.floor(Date.now() / 1000)
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')  // 7 days, matching maxAge
      .sign(secret);

    const response = NextResponse.json({
      success: true,
      role: role // Return role to frontend for redirect logic
    });

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
