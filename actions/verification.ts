"use server";

import {
  TVerificationFormSchema,
  verificationInsertSchema,
} from "@/schema/verification";

export async function verifyData(data: TVerificationFormSchema) {
  const res = verificationInsertSchema.safeParse(data);

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
