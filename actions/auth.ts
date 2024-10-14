"use server";

import {
  createSessionOptions,
  defaultAuthRedirect,
  defaultSessionOptions,
  TSessionData,
} from "@/config/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  signInClientSchema,
  TSignInClientSchema,
} from "@/schema/signin.schema";
import { authUserSchema } from "@/schema/user.schema";
import { hashPassword } from "@/utils/hashPassword";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendResetPasswordEmail } from "./email";
import { getPathname } from "./url";

export async function credentialsSignIn(credentials: TSignInClientSchema) {
  const validationResult = signInClientSchema.safeParse(credentials);

  if (!validationResult.success) {
    throw new Error("Неверные данные для входа");
  }

  const { email, password, rememberMe } = credentials;

  const oneDaySeconds = 24 * 60 * 60;

  const oneMonthSeconds = 30 * oneDaySeconds;

  const sessionOptions = createSessionOptions({
    cookieOptions: {
      ...defaultSessionOptions.cookieOptions,
      maxAge: !!rememberMe ? oneMonthSeconds : oneDaySeconds,
    },
  });

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.email, email),
  });

  if (!user || !!!user.emailVerified) {
    throw new Error("Неверные данные для входа");
  }

  const passwordVerified = await compare(password, user.password);

  if (!passwordVerified) {
    throw new Error("Неверные данные для входа");
  }

  const session = await getAuthSession();

  session.updateConfig(sessionOptions);

  session.user = authUserSchema.parse(user);

  await session.save();

  redirect(defaultAuthRedirect);
}

export async function signOutAction() {
  const session = await getAuthSession();

  const callbackPath = await getPathname();

  session.destroy();

  redirect(callbackPath);
}

export async function getAuthSession(options?: SessionOptions) {
  const cookiesStore = cookies();

  const session = await getIronSession<TSessionData>(
    cookiesStore,
    options ?? defaultSessionOptions
  );

  return session;
}

export async function recoverPassword(email: string) {
  sendResetPasswordEmail(email);

  return redirect("/recover/complete");
}

async function resetPassword(newPassword: string, token: string) {
  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: hashedPassword, resetPasswordToken: null })
    .where(eq(users.resetPasswordToken, token));

  return redirect("/reset/complete");
}
