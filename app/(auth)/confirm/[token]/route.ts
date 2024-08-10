import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unsealData } from "iron-session";
import { JsonWebTokenError } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params: { token } }: { params: { token: string } }
) {
  const url = request.nextUrl.clone();

  const tokenData = await unsealData<Record<"id" | "token", string>>(token, {
    password: process.env.MAGIC_LINK_SECRET!,
  }).catch(() => null);

  if (!tokenData) {
    url.pathname = "/confirm/wrong";
    return NextResponse.redirect(url, request);
  }

  const user = (
    await db.select().from(users).where(eq(users.id, tokenData.id)).limit(1)
  ).pop();

  if (!user || user.verificationToken !== tokenData.token) {
    url.pathname = "/confirm/wrong";
    return NextResponse.redirect(url, request);
  }

  await db
    .update(users)
    .set({ verificationToken: null, emailVerified: new Date() })
    .where(eq(users.id, tokenData.id));

  url.pathname = "/confirm/complete";

  return NextResponse.redirect(url, request);
}
