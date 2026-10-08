import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Consolidate on the www host for the production domain only. Localhost and
  // CI/preview domains keep their original host to avoid broken redirects.
  if (host === 'monsarazcastle.com') {
    const url = request.nextUrl.clone();
    url.host = 'www.monsarazcastle.com';
    return NextResponse.redirect(url, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
