"use server";

import { db } from "@/db";
import { verification } from "@/db/schema";
import {
  TVerificationFormSchema,
  serverVerificationSchema,
} from "@/schema/verification";
import { getAuthSession } from "./auth";

export async function verifyData(data: TVerificationFormSchema) {
  const session = await getAuthSession();

  if (!session.user) {
    return {
      success: false,
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

export async function confirmVerification() {
  return {
    data: true,
  };
}

export async function rejectVerification() {
  return {
    data: false,
  };
}
