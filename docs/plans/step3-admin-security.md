# Step 3: Admin Security & Hidden Entry Points

**Created**: 2025-11-06
**Updated**: 2025-11-06 (added role-based access control + rate limiting)
**Status**: ✅ **COMPLETED**
**Implementation Time**: 1 hour

> **✅ Completed on 2025-11-06** - See [implementation summary](../completed/step3-admin-security-implementation.md) for details

## Objective
Add security and hidden entry points to the admin dashboard that was created in Step 2.

## Current State
- ✅ Admin dashboard exists at `/admin` (server component, no auth)
- ✅ JWT authentication system already exists (for main app)
- ✅ Login page and API already built (`/login`, `/api/login`)
- ⚠️ Admin route is temporarily public (line 12 in middleware.ts)
- ⚠️ Current JWT doesn't distinguish user roles (security issue!)
- ❌ No keyboard shortcut entry point
- ❌ No hidden footer link

## ⚠️ Critical Security Requirements

### 1. Role-Based Access Control (Privilege Escalation)

**Problem**: Using the same JWT token for both regular users and admin creates a privilege escalation vulnerability. Anyone with APP_PASSWORD would be able to access the admin dashboard.

**Solution**: Add role-based access control to JWT tokens to properly separate privileges.

### 2. Rate Limiting (Brute Force Protection)

**Problem**: Without rate limiting, attackers could brute force the ADMIN_PASSWORD.

**Solution**: Use Redis (already available) for distributed rate limiting that works with Vercel's serverless architecture.

## Implementation Tasks

### Task 1: Secure Admin Dashboard with Role-Based Access + Rate Limiting (50 mins)

1. **Add rate limiting to `/api/login/route.ts`**
   ```typescript
   import { getRedisClient } from '@/lib/logging'

   async function checkRateLimit(ip: string): Promise<boolean> {
     const client = getRedisClient()
     const key = `login-attempts:${ip}`

     try {
       const attempts = await client.incr(key)

       if (attempts === 1) {
         // First attempt, set 5-minute expiry
         await client.expire(key, 300)
       }

       if (attempts > 5) {
         return false // Too many attempts
       }

       return true
     } catch (error) {
       console.error('Rate limit check failed:', error)
       return true // Fail open if Redis is down
     }
   }

   export async function POST(request: Request) {
     // Get IP for rate limiting
     const ip = request.headers.get('x-forwarded-for') ||
                request.headers.get('x-real-ip') ||
                'unknown'

     // Check rate limit
     if (!await checkRateLimit(ip)) {
       return NextResponse.json(
         { success: false, error: 'Too many attempts. Try again in 5 minutes.' },
         { status: 429 }
       )
     }

     const { password } = await request.json()
     const cleanPassword = password.replace(/\s+/g, '')

     // Check both passwords and assign appropriate role
     const appPassword = process.env.AUTH_PASSWORD
     const adminPassword = process.env.ADMIN_PASSWORD

     let role = null
     if (cleanPassword === adminPassword) {
       role = 'admin'
     } else if (cleanPassword === appPassword) {
       role = 'user'
     }

     if (role) {
       // Generate JWT with role
       const token = await new SignJWT({
         authenticated: true,
         role: role,
         iat: Math.floor(Date.now() / 1000)
       })
       .setProtectedHeader({ alg: 'HS256' })
       .setIssuedAt()
       .setExpirationTime('7d')
       .sign(secret)
       // ... set cookie and return success
     }
   }
   ```

2. **Update middleware.ts to check role for admin routes**
   ```typescript
   // Remove /admin from public paths (line 12)
   // Add role check for admin routes
   if (pathname.startsWith('/admin')) {
     const authToken = request.cookies.get('auth-token')
     if (!authToken?.value) {
       return NextResponse.redirect(new URL('/login', request.url))
     }

     try {
       const { payload } = await jwtVerify(authToken.value, secret)
       if (payload.role !== 'admin') {
         // User is authenticated but not admin
         return NextResponse.redirect(new URL('/', request.url))
       }
       return NextResponse.next()
     } catch {
       return NextResponse.redirect(new URL('/login', request.url))
     }
   }
   ```

3. **Environment variable**
   - Add `ADMIN_PASSWORD` to `.env.local` and Vercel
   - Keep `AUTH_PASSWORD` for regular users

### Task 2: Add Hidden Entry Points (20 mins)

1. **Keyboard Shortcut** (in `app/page.tsx`)
   ```typescript
   // Add import at top
   import { useRouter } from 'next/navigation'

   // Inside component
   const router = useRouter()

   // Add useEffect for keyboard listener
   useEffect(() => {
     const handleKeyPress = (e: KeyboardEvent) => {
       if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
         e.preventDefault()
         router.push('/admin')
       }
     }
     window.addEventListener('keydown', handleKeyPress)
     return () => window.removeEventListener('keydown', handleKeyPress)
   }, [router])
   ```

2. **Footer Link** (in `app/page.tsx`)
   ```typescript
   // Add import at top
   import Link from 'next/link'

   // Update footer - add subtle link
   <footer className="mt-auto border-t border-gray-100 bg-white">
     <div className="max-w-2xl mx-auto px-4 py-6 flex justify-between items-center">
       <p className="text-center text-xs text-gray-500 flex-1">
         © 2025 AI Skin Analyzer. For informational purposes only.
         Not a substitute for professional medical advice.
       </p>
       <Link href="/admin" className="text-gray-400 text-xs hover:text-gray-500">
         v1.0
       </Link>
     </div>
   </footer>
   ```

### Task 3: Testing (20 mins)

1. Test keyboard shortcut (Ctrl+Shift+A / Cmd+Shift+A)
2. Test footer link navigation
3. Test admin login with ADMIN_PASSWORD → should access `/admin`
4. Test regular user login with AUTH_PASSWORD → should NOT access `/admin`
5. Test that `/admin` redirects to login when not authenticated
6. Test that regular authenticated users are redirected from `/admin` to `/`
7. Verify role is correctly set in JWT payload
8. **Rate Limiting Tests**:
   - Try 5 login attempts → all should work
   - 6th attempt → should get 429 error
   - Wait 5 minutes → should work again
   - Test from different IPs work independently

## Files to Modify

1. **middleware.ts**:
   - Remove `/admin` from public paths
   - Add role-based access control for admin routes
2. **app/page.tsx**: Add keyboard shortcut + update footer
3. **app/api/login/route.ts**: Add role-based JWT generation
4. **.env.local**: Add ADMIN_PASSWORD

## Environment Variables

```bash
# Existing
AUTH_PASSWORD=xxx  # For regular users

# New
ADMIN_PASSWORD=xxx  # For admin dashboard access
```

## Deployment Steps

1. Set `ADMIN_PASSWORD` in Vercel dashboard
2. Deploy code changes
3. Test in production

## Why This Approach?

1. **Proper security**: Role-based access control prevents privilege escalation
2. **Reuse existing auth**: No need for completely separate JWT system
3. **Single login page**: Simpler UX, less code
4. **Clear separation**: Admin and user roles explicitly defined in JWT
5. **Minimal changes**: ~100 lines of code total
6. **Security best practice**: Role-based tokens are industry standard

## Security Benefits

- **No privilege escalation**: Regular users with AUTH_PASSWORD cannot access admin
- **Brute force protection**: Rate limiting prevents password guessing attacks
- **Clear audit trail**: JWT payload shows who has admin role
- **Easy revocation**: Can change ADMIN_PASSWORD without affecting regular users
- **Future-proof**: Can easily add more roles or permissions later
- **Distributed rate limiting**: Works across Vercel's serverless instances
- **Automatic cleanup**: Redis TTL expires old rate limit counters

## Alternatives Considered (Rejected)

### 1. Same JWT for all users
Using the same JWT token for both user and admin access.

**Rejected because**: Creates privilege escalation vulnerability where any authenticated user could access admin dashboard.

### 2. In-Memory Rate Limiting
Using a JavaScript Map to store login attempts in memory.

**Rejected because**: Won't work with Vercel's serverless functions:
- Each function invocation gets fresh memory
- No shared state between invocations
- Rate limit would reset on every request

**Redis is required** for rate limiting in serverless environments.

## Migration Note

**Existing JWT tokens** (without role field):
- Current users will need to re-login after deployment
- This is acceptable for a one-time security upgrade
- Alternative: Could check for missing role and treat as 'user', but cleaner to force re-auth

## Success Criteria

- [ ] Admin dashboard requires authentication with admin role
- [ ] Regular users cannot access /admin (redirected to /)
- [ ] Keyboard shortcut works (Ctrl+Shift+A)
- [ ] Footer link is subtle but clickable
- [ ] ADMIN_PASSWORD grants admin role
- [ ] AUTH_PASSWORD grants user role
- [ ] No visible admin links in main UI
- [ ] JWT payload contains role field
- [ ] Login rate limiting works (5 attempts per IP per 5 minutes)
- [ ] 429 error returned after exceeding rate limit
- [ ] Rate limiting uses Redis (works across serverless instances)