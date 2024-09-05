"use server";

import {
  createSessionOptions,
  defaultAuthRedirect,
  defaultSessionOptions,
  routes,
  TSessionData,
} from "@/config/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  signInClientSchema,
  TSignInClientSchema,
} from "@/schema/signin.schema";
import { selectUserSchema } from "@/schema/user.schema";
import { compare } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendResetPasswordEmail } from "./email";
import { getPathname } from "./url";
import { hashPassword } from "@/utils/hashPassword";

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

  const user = (
    await db.select().from(users).where(eq(users.email, email)).limit(1)
  ).pop();

  if (!user || !!!user.emailVerified) {
    throw new Error("Неверные данные для входа");
  }

  const passwordVerified = await compare(password, user.password);

  if (!passwordVerified) {
    throw new Error("Неверные данные для входа");
  }

  const session = await getAuthSession();

  session.updateConfig(sessionOptions);

  session.user = selectUserSchema.parse(user);

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

export async function authRedirect() {
  const session = await getAuthSession();

  const isAuthenticated = !!session.user;

  const pathname = await getPathname();

  const isGuestRoute = routes.guest.some((r) => pathname.includes(r));

  const isPublicRoute = routes.public.some((r) => pathname.includes(r));

  if (isAuthenticated && isGuestRoute) {
    return redirect(defaultAuthRedirect);
  }

  if (!isGuestRoute && !isPublicRoute && !isAuthenticated) {
    return redirect("/signin");
  }
}

export async function recoverPassword(email: string) {
  sendResetPasswordEmail(email);

  return redirect("/recover/complete");
}

export async function resetPassword(newPassword: string, id: string) {
  const hashedPassword = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ password: hashedPassword, resetPasswordToken: null })
    .where(eq(users.id, id));

  return redirect("/reset/complete");
}
