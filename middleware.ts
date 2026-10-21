import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LOCALE = "vi";
const LOCALES = ["vi", "en"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for:
  // - API routes
  // - Admin routes
  // - Static files (_next, assets, images, locales, etc.)
  // - Files with extensions (favicon, robots.txt, sitemap.xml, etc.)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/locales") ||
    pathname.startsWith("/static") ||
    pathname.match(
      /\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|json|xml|txt|pdf|woff|woff2|ttf|eot)$/i,
    ) // Files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  // If pathname already has a locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect root path to default locale
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}`;
    // Preserve query parameters if any
    return NextResponse.redirect(url, 308); // 308 Permanent Redirect for SEO
  }

  // Redirect paths without locale to default locale
  // e.g., /san-pham -> /vi/san-pham
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  // Preserve query parameters
  return NextResponse.redirect(url, 308); // 308 Permanent Redirect for SEO
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - files with extensions (images, etc.)
     * - admin (admin routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|admin).*)",
  ],
};
