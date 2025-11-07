'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if admin access is required
  const redirectPath = searchParams.get('redirect');
  const reason = searchParams.get('reason');
  const needsAdmin = reason === 'admin-required';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.replace(/\s+/g, '') }),
      });

      const data = await response.json();

      if (data.success) {
        // Use redirect path from query if available, otherwise redirect based on role
        let targetPath = redirectPath || (data.role === 'admin' ? '/admin' : '/');
        console.log('Login successful, redirecting to:', targetPath);
        // Use router.push with a small delay to ensure cookie is set
        setTimeout(() => {
          window.location.href = targetPath;
        }, 100);
      } else {
        // Show actual error message from API
        setError(data.error || 'Invalid password');
        setPassword('');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">🔒</h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {needsAdmin ? 'Admin Dashboard' : 'AI Skin Analyzer'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {needsAdmin ? 'Admin Access Required' : 'Access Required'}
          </p>
          {needsAdmin && (
            <p className="mt-2 text-xs text-amber-600">
              Please enter the admin password to continue
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">⚠️ {error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Access'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
