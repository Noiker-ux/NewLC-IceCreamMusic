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
  const tokenData = await unsealData<Record<"token", string>>(token, {
    password: process.env.MAGIC_LINK_SECRET!,
    ttl: 60 * 10,
  }).catch(() => null);

  if (!tokenData) {
    redirect(wrongUrl);
  }

  const user = (
    await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, tokenData.token))
      .limit(1)
  ).pop();

  if (!user) {
    redirect(wrongUrl);
  }

  return <div>Reset Password</div>;
}
