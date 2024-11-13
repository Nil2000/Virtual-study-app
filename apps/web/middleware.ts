import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import {
  authRoutes,
  authPrefix,
  publicRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "@/lib/routes";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

// Or like this if you need to do something here.
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoutes = nextUrl.pathname.startsWith(authPrefix);

  if (isApiAuthRoutes) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl));
  }

  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)", "/"],
};
