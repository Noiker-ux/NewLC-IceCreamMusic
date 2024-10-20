import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unsealData } from "iron-session";
import { redirect } from "next/navigation";
import MyButton from "@/shared/MyButton/MyButton";
import MyInput from "@/shared/MyInput/MyInput";
// import { resetPassword } from "@/actions/auth";

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

  // resetPassword();

  return (
    <div>
      <MyInput label="Введите пароль" type="text" />
      <MyInput label="Повторите пароль" type="text" />
      <MyButton text="Изменить пароль" view="secondary" />
    </div>
  );
}
