import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXT_AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    const pathname = req.nextUrl.pathname;
    // Remove locale from the path 
    const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?/, "");

    // If the user is not authenticated, redirect them to login
    if (!token) {
      if (pathnameWithoutLocale.startsWith("/admin") || pathnameWithoutLocale.startsWith("/books")) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      // If user is authenticated, restrict access to routes based on their role
      if (pathnameWithoutLocale.startsWith("/admin") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/404", req.url));
      }

      if (pathnameWithoutLocale.startsWith("/books") && token.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // Pass the request to next-intl middleware to handle locales
    return intlMiddleware(req);
  } catch (error) {
    console.error("Error in middleware:", error);
    // Fallback to avoid breaking if there's an issue with the token or routing
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Avoid applying middleware to API and static routes
};
