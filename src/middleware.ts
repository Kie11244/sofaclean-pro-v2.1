import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

import {i18n} from '@/i18n.config';

import {match as matchLocale} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = i18n.locales as any;
  const languages = new Negotiator({headers: negotiatorHeaders}).languages();

  try {
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    // Fallback to default locale if match fails
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Skip middleware for admin routes and static files
  if (pathname.startsWith('/admin') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|admin).*)'],
};
