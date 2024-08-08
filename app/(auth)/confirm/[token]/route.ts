import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params: { token } }: { params: { token: string } }
) {
  try {
    const tokenData = verify(token, process.env.MAGIC_LINK_SECRET!);

    if (typeof tokenData !== "string") {
      console.log(tokenData);
      const url = request.nextUrl.clone();
      url.pathname = "/account";
    }

    return NextResponse.json({ qwe: 123 }, request);
  } catch (e) {
    return NextResponse.json(e);
  }
}
