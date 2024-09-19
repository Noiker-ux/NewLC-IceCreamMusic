import { NextRequest, NextResponse } from "next/server";
import {
  defaultAuthRedirect,
  defaultSessionOptions,
  routes,
  TSessionData,
} from "./config/auth";
import { getPathname } from "./actions/url";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const middleware = async function (request: NextRequest) {
  const { nextUrl } = request;

  request.headers.set("x-url", nextUrl.href);

  const cookiesStore = cookies();

  const session = await getIronSession<TSessionData>(
    cookiesStore,
    defaultSessionOptions
  );

  const isAuthenticated = !!session.user;

  const pathname = await getPathname();

  const isGuestRoute = routes.guest.some((r) => pathname.includes(r));

  const isPublicRoute = routes.public.some((r) => pathname.includes(r));

  if (isAuthenticated && isGuestRoute) {
    const defaultRedirectUrl = nextUrl.clone();

    defaultRedirectUrl.pathname = defaultAuthRedirect;

    return NextResponse.redirect(defaultRedirectUrl, {
      headers: request.headers,
    });
  }

  if (!isGuestRoute && !isPublicRoute && !isAuthenticated) {
    const signInUrl = nextUrl.clone();

    signInUrl.pathname = "/signin";

    return NextResponse.redirect(signInUrl, { headers: request.headers });
  }

  return NextResponse.next({ request });
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|models|assets).*)"],
};
