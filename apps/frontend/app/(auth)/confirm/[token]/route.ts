import { db } from "db";
import { users } from "db/schema";
import { eq } from "drizzle-orm";
import { unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const wrongPath = "/confirm/wrong";

export async function GET(
  request: NextRequest,
  { params: { token } }: { params: { token: string } }
) {
  const tokenData = await unsealData<Record<"id" | "token", string>>(token, {
    password: process.env.MAGIC_LINK_SECRET!,
  }).catch(() => null);

  if (!tokenData) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}${wrongPath}`,
      request
    );
  }

  const user = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.id, tokenData.id),
  });

  if (!user || user.verificationToken !== tokenData.token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_DOMAIN}${wrongPath}`,
      request
    );
  }

  await db
    .update(users)
    .set({ verificationToken: null, emailVerified: new Date() })
    .where(eq(users.id, tokenData.id));

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_DOMAIN}/confirm/complete`,
    request
  );
}
