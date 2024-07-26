"use server";

import { TSignUpSchema } from "@/schema/signup.schema";

export async function registerUser(data: TSignUpSchema) {
  console.log(data);

  return "user created";
}

export async function editUser() {
  return "user updated";
}
