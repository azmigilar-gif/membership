import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = [
    '/login',
    '/signin',
    '/signup',
    '/(full-width-pages)/(auth)/signin',
    '/(full-width-pages)/(auth)/signup',
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.includes(route));

  // helper: validate token by calling /api/auth/me with forwarded cookies
  async function getAuthUser() {
    try {
      const url = new URL('/api/auth/me', request.url);
      const res = await fetch(url.toString(), {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      });

      if (!res.ok) return null;
      const json = await res.json();
      return json.user || null;
    } catch (err) {
      return null;
    }
  }

  // If accessing admin routes (including admin-new), verify via API
  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/dashboard/admin' ||
    pathname.startsWith('/dashboard/admin/') ||
    pathname === '/admin-new' ||
    pathname.startsWith('/admin-new/')
  ) {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/member', request.url));
    }

    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }
  }

  // If accessing member routes, verify token via API
  if (pathname.startsWith('/member')) {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If user is logged in and tries to access signin/signup, redirect to dashboard
  if (isPublicRoute) {
    const user = await getAuthUser();
    if (user) {
      const dashboardUrl = user.role === 'admin' ? '/admin-new' : '/member';
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
