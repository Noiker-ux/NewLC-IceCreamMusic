"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signUpSchema, TSignUpClientSchema } from "@/schema/signup.schema";
import { hashPassword } from "@/utils/hashPassword";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sendSignUpConfirmEmail } from "./email";

export async function registerUser(userData: TSignUpClientSchema) {
  const { email, name, password } = signUpSchema.parse(userData);

  const matchedUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (matchedUser.length) {
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

// export async function updateUser(id: string, data: Partial<TSelectUserSchema>) {
//   await db
//     .update(users)
//     .set(data)
//     .where(eq(users.id, id))
//     .returning({ id: users.id });
//   return "user updated";
// }
