import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("Middleware invoked");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;
  console.log(token);
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/books")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    if (pathname.startsWith("/books") && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/books/:path*"],
};
