import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  // Clear the auth token by setting it with immediate expiry
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Immediate expiry
    path: '/',
  });

  return response;
}