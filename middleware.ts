import { auth, defaultAuthRedirect, routes } from "@/config/auth";
import { NextResponse } from "next/server";

export const middleware = auth(async function (request) {
  const { nextUrl } = request;

  request.headers.set("x-url", nextUrl.href);

  const newUrl = nextUrl.clone();

  const isAuthenticated = !!request.auth;

  const pathName = nextUrl.pathname;

  const isGuestRoute = routes.guest.some((r) => pathName.includes(r));

  const isPublicRoute = routes.public.some((r) => pathName.includes(r));

  if (isAuthenticated && isGuestRoute) {
    newUrl.pathname =
      nextUrl.searchParams.get("callbackUrl") ?? defaultAuthRedirect;
    return NextResponse.redirect(newUrl, request);
  }

  if (!isGuestRoute && !isPublicRoute && !isAuthenticated) {
    newUrl.pathname = "/signin";
    newUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(newUrl, request);
  }

  return NextResponse.next({ request });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|models|assets).*)"],
};
