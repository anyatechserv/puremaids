import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/book', '/subscriptions', '/privacy', '/terms', '/cookies', '/contact', '/login', '/register', '/forgot-password'];
const AUTH_ROUTES = ['/account', '/admin'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
}

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Add security headers as defense-in-depth (also set in next.config.js)
  res.headers.set('X-Robots-Tag', 'index, follow');

  // Route protection: check for auth token on protected routes
  const isProtected = AUTH_ROUTES.some(r => pathname.startsWith(r));
  if (isProtected) {
    const token = request.cookies.get('sb-access-token')?.value;
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Prevent access to admin routes without admin token (client-side check too, but this is defense-in-depth)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('sb-access-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.json).*)'],
};
