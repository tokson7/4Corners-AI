import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes that don't require auth
const isPublicRoute = createRouteMatcher([
  '/',
  '/showcase',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/showcase/contact',
])

// Admin routes that require admin role
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

// Protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/generate(.*)',
  '/account(.*)',
  '/billing(.*)',
])

// Protected API routes (require authentication)
const isProtectedApiRoute = createRouteMatcher([
  '/api/design-systems(.*)',
  '/api/user(.*)',
  '/api/billing(.*)',
  '/api/account(.*)',
  '/api/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes
  if (isAdminRoute(req)) {
    const { userId } = await auth()
    
    if (!userId) {
      // Not signed in - redirect to sign-in
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Admin role check will happen in the admin layout
    // This is just the first authentication check
  }

  // Skip auth for public routes
  if (isPublicRoute(req)) {
    return
  }

  // For protected API routes, don't redirect - let them handle auth
  if (isProtectedApiRoute(req)) {
    return
  }

  // Protect all other routes (dashboard, generate, etc.)
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
});

export const config = {
  matcher: [
    // Only run middleware on protected routes (removes 200ms overhead from public pages)
    '/dashboard/:path*',
    '/generate/:path*',
    '/account/:path*',
    '/billing/:path*',
    '/admin/:path*',
    '/api/design-systems/:path*',
    '/api/user/:path*',
    '/api/billing/:path*',
    '/api/account/:path*',
    '/api/admin/:path*',
    '/api/stripe/create-checkout-session', // Stripe checkout requires auth
    '/api/stripe/create-portal-session',  // Stripe portal requires auth
    '/api/generate-design-system',        // Design system generation requires auth
    '/api/generate/colors',               // Color generation requires auth
    '/api/generate-components',           // Component generation requires auth
  ],
}
