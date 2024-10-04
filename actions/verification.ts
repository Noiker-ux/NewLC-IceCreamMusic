"use server";

import { db } from "@/db";
import { verification } from "@/db/schema";
import {
  TVerificationFormSchema,
  serverVerificationSchema,
} from "@/schema/verification.schema";
import { getAuthSession } from "./auth";
import { isAdminUser } from "./users";
import { eq } from "drizzle-orm";
import { revalidateCurrentPath } from "./revalidate";

export async function verifyData(data: TVerificationFormSchema) {
  const session = await getAuthSession();

  if (!session.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const res = serverVerificationSchema.safeParse(data);

  if (res.success) {
    const verificationTickets = await db
      .insert(verification)
      .values({
        ...res.data,
        userId: session.user.id,
      })
      .returning({ id: verification.id });
  }

  return {
    success: res.success,
  };
}

export async function approveVerification(id: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  await db
    .update(verification)
    .set({ status: "approved" })
    .where(eq(verification.id, id));

  await revalidateCurrentPath();

  return { success: true };
}

export async function rejectVerification(id: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  await db
    .update(verification)
    .set({ status: "rejected" })
    .where(eq(verification.id, id));

  await revalidateCurrentPath();

  return { success: true };
}
