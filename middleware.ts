import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'admin_token';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not configured');
    }
    return new TextEncoder().encode('afiu-admin-secret-key-change-in-production');
  }
  return new TextEncoder().encode(secret);
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

function originAllowed(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    return originUrl.host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith('/admin/dashboard');
  const isProtectedApi =
    pathname.startsWith('/api/admin') ||
    pathname.startsWith('/api/gallery-items') ||
    pathname === '/api/upload' ||
    pathname.startsWith('/api/appointments/availability');

  if (!isAdminPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const authed = await isAuthenticated(request);

  if (!authed) {
    if (isAdminPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isProtectedApi && request.method !== 'GET' && request.method !== 'HEAD') {
    if (!originAllowed(request)) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
    }
  }

  const res = NextResponse.next();

  if (isAdminPage || isProtectedApi) {
    res.headers.set('Cache-Control', 'no-store');
  }

  return res;
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/admin/:path*',
    '/api/gallery-items',
    '/api/gallery-items/:path*',
    '/api/upload',
    '/api/appointments/availability',
    '/api/appointments/availability/:path*',
  ],
};
