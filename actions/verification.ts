"use server";

import { TVerificationSchema } from "@/schema/verification";

export async function verifyData(data: TVerificationSchema) {
  return {
    success: Boolean(Math.round(Math.random())),
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
