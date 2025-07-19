import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the pathname starts with a supported locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // If no locale is present, it's considered the default locale (Thai).
  // We rewrite the URL internally to /th/... so Next.js can handle it,
  // but the user sees the URL without the /th prefix.
  const newUrl = request.nextUrl.clone()
  newUrl.pathname = `/th${pathname}`
  return NextResponse.rewrite(newUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!_next|api|favicon.ico|images).*)',
    // Match root separately to avoid issues
    '/',
  ],
}
