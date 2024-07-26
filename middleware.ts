import { auth, defaultAuthRedirect, routes } from "@/config/auth";
import { NextResponse } from "next/server";

export const middleware = auth(async function (request) {
  const { nextUrl } = request;

  const headers = new Headers(request.headers);

  headers.set("x-url", nextUrl.href);

  const newUrl = nextUrl.clone();

  const isAuthenticated = !!request.auth;

  const isGuestRoute = routes.guest.includes(nextUrl.pathname);

  const isPublicRoute = routes.public.includes(nextUrl.pathname);

  if (isAuthenticated && isGuestRoute) {
    newUrl.pathname =
      nextUrl.searchParams.get("callbackUrl") ?? defaultAuthRedirect;
    return NextResponse.redirect(newUrl, { headers });
  }

  if (!isGuestRoute && !isPublicRoute && !isAuthenticated) {
    newUrl.pathname = "/signin";
    newUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(newUrl, { headers });
  }

  return NextResponse.next({ headers });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|models|assets).*)"],
};
