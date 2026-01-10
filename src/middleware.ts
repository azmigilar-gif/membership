import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = [
    '/signin',
    '/signup',
    '/(full-width-pages)/(auth)/signin',
    '/(full-width-pages)/(auth)/signup',
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.includes(route));

  // If accessing admin routes, verify token
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    // Admin routes require admin role
    if (payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/member', request.url));
    }
  }

  // If accessing member routes, verify token
  if (pathname.startsWith('/member')) {
    if (!token) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // If user is logged in and tries to access signin/signup, redirect to dashboard
  if (isPublicRoute && token) {
    const payload = verifyToken(token);
    if (payload) {
      const dashboardUrl = payload.role === 'admin' ? '/admin' : '/member';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
