"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signUpSchema, TSignUpClientSchema } from "@/schema/signup.schema";
import { hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";
import { sendSignUpConfirmEmail } from "./email";

export async function registerUser(userData: TSignUpClientSchema) {
  const { success, data, error } = signUpSchema.safeParse(userData);

  if (!success) {
    return { message: error.errors.map((e) => e.message).join("\n") };
  }

  const { email, name, password } = data;

  const matchedUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (matchedUser.length) {
    return { message: "User with this email already exists" };
  }

  const hashedPassword = await hash(password, 12);

  const newUsers = await db
    .insert(users)
    .values({ email, name, password: hashedPassword })
    .returning({ id: users.id });

  const { id } = newUsers[0];

  await sendSignUpConfirmEmail(email, id);

  return { message: "success" };
}

export async function editUser() {
  return "user updated";
}
