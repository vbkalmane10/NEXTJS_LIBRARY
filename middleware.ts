import createMiddleware from "next-intl/middleware";
 import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const intlMiddleware = createMiddleware(routing);
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXT_AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const pathname = req.nextUrl.pathname;
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, '');

  // If the user is not authenticated, redirect them to login for certain paths
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/books")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // If user is authenticated, restrict access to routes based on their role
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    if (pathname.startsWith("/books") && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // NextIntl middleware ensures that the locale is applied correctly
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

