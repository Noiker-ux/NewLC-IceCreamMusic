"use server";

import { db } from "db";
import { users, verification } from "db/schema";
import {
  TVerificationFormSchema,
  serverVerificationSchema,
} from "@/schema/verification.schema";
import { getAuthSession } from "./auth";
import { isAdminUser } from "./users";
import { eq } from "drizzle-orm";
import { sendVerificationNotification } from "./email";
import { createSMTPClient } from "@/shared/utils/createSMTPClient";

export async function verifyData(data: TVerificationFormSchema) {
  const session = await getAuthSession();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const verificationData = await db.query.verification.findFirst({
    where: (ver, { eq, and }) =>
      and(eq(ver.userId, session.id), eq(ver.status, "approved")),
  });

  if (!!verificationData) {
    return { success: false, message: "Пользователь уже был верифицирован" };
  }

  const res = await serverVerificationSchema.parseAsync(data).catch(() => null);

  if (res) {
    const isSuccess = await db
      .insert(verification)
      .values({
        ...res,
        userId: session.id,
      })
      .catch(() => false)
      .then(() => true);

    return {
      success: isSuccess,
      message: isSuccess
        ? "Открыт запрос на верификацию"
        : "Не получается открыть запрос на вериифкацию",
    };
  }

  return {
    success: false,
    message: "Проверьте заполнение полей",
  };
}

export async function approveVerification(id: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const isSuccess = await db
    .transaction(async () => {
      const verificationData = await db.query.verification.findFirst({
        where: (ver, { eq }) => eq(ver.id, id),
        with: {
          user: {
            columns: { email: true },
          },
        },
      });

      if (!verificationData) {
        throw new Error("there is not enough verifications");
      }

      await db
        .update(verification)
        .set({ status: "approved" })
        .where(eq(verification.id, id));

      await db
        .update(users)
        .set({ isVerifiedAuthor: true })
        .where(eq(users.id, verificationData.userId));

      const transport = await createSMTPClient().catch(() => null);

      if (!transport) {
        throw new Error("Что-то пошло не так");
      }

      await sendVerificationNotification(
        verificationData.user.email,
        transport,
        "approved"
      );
    })
    .then(() => true)
    .catch(() => false);

  if (!isSuccess) {
    return { success: false, message: "Что-то пошло не так" };
  }

  return { success: true };
}

export async function rejectVerification(id: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false, message: "Unauthorized" };
  }

  const isSuccess = await db
    .transaction(async () => {
      const verificationData = await db.query.verification.findFirst({
        where: (ver, { eq }) => eq(ver.id, id),
        with: {
          user: {
            columns: { email: true },
          },
        },
      });

      if (!verificationData) {
        throw new Error("there is not enough verifications");
      }

      await db
        .update(verification)
        .set({ status: "rejected" })
        .where(eq(verification.id, id));

      const transport = await createSMTPClient().catch(() => null);

      if (!transport) {
        throw new Error("Что-то пошло не так");
      }

      await sendVerificationNotification(
        verificationData.user.email,
        transport,
        "rejected"
      );
    })
    .then(() => true)
    .catch(() => false);

  if (!isSuccess) {
    return { success: false, message: "Что-то пошло не так" };
  }

  return { success: true };
}
