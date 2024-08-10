import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unsealData } from "iron-session";
import { redirect } from "next/navigation";

const wrongUrl = "/reset/wrong";

export default async function ResetPasswordPage({
  params: { token },
}: {
  params: { token: string };
}) {
  const tokenData = await unsealData<Record<"id" | "token", string>>(token, {
    password: process.env.MAGIC_LINK_SECRET!,
    ttl: 60 * 10,
  }).catch(() => null);

  if (!tokenData) {
    redirect(wrongUrl);
  }

  const user = (
    await db.select().from(users).where(eq(users.id, tokenData.id)).limit(1)
  ).pop();

  if (!user || user.resetPasswordToken !== tokenData.token) {
    redirect(wrongUrl);
  }

  return <div>Reset Password</div>;
}
