"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signInSchema } from "@/schema/signin.schema";
import { signUpSchema, TSignUpClientSchema } from "@/schema/signup.schema";
import { compare, hash } from "bcrypt-ts";
import { eq } from "drizzle-orm";

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

  return newUsers[0];
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash);
}

export async function editUser() {
  return "user updated";
}

export async function getAuthUser(
  userData: Partial<Record<"email" | "password", unknown>>
) {
  // const { success, data } = signInSchema.safeParse(userData);

  // if (!success) {
  //   return null;
  // }

  // const { email, password } = data;

  // const matchedUser = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.email, email))
  //   .limit(1);

  // if (!matchedUser.length) {
  //   return null;
  // }

  // const user = matchedUser[0];

  // const passwordVerified = await verifyPassword(password, user.password);

  // if (passwordVerified) {
  //   return user;
  // }

  return null;
}
