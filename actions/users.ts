"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signUpSchema, TSignUpClientSchema } from "@/schema/signup.schema";
import { hashPassword } from "@/utils/hashPassword";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sendSignUpConfirmEmail } from "./email";
import { getAuthSession } from "./auth";

export async function registerUser(userData: TSignUpClientSchema) {
  const { email, name, password } = signUpSchema.parse(userData);

  const matchedUser = await db.query.users.findFirst({
    where: (us, { eq }) => eq(us.email, email),
  });

  if (matchedUser) {
    throw new Error(
      "Учетная запись с данным адресом эл. почты уже существует."
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = (
    await db
      .insert(users)
      .values({ email, name, password: hashedPassword })
      .returning({ id: users.id })
  ).pop();

  if (!newUser) throw new Error("Что-то пошло не так");

  await sendSignUpConfirmEmail(email, newUser.id);

  return redirect("/signup/complete");
}

export async function isAdminUser() {
  const session = await getAuthSession();

  if (!session.user) {
    return false;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) return false;

  return user.isAdmin;
}

export async function getUserSubscriptionLevel() {
  const session = await getAuthSession();

  if (!session.user) {
    return false;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) return false;

  if (user.isSubscribed) return user.subscriptionLevel ?? false;

  return false;
}
