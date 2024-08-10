import { NextRequest, NextResponse } from "next/server";

export const middleware = async function (request: NextRequest) {
  const { nextUrl } = request;

  request.headers.set("x-url", nextUrl.href);

  return NextResponse.next({ request });
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|models|assets).*)"],
};
