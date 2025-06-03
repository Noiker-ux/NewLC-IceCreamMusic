"use server";

import { db } from "db";
import { isAdminUser } from "../users";
import { release } from "db/schema";
import { eq } from "drizzle-orm";
import { createSMTPClient } from "@/shared/utils/createSMTPClient";
import { sendModerationNotification } from "../email";
import { revalidateCurrentPath } from "../revalidate";

export async function approveRelease(releaseId: string, upc: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return {
      success: false,
      message: "Недостаточно прав для выполнения действия",
    };
  }

  const isSuccess = await db
    .transaction(async () => {
      const releaseData = await db.query.release.findFirst({
        where: (rel, { eq }) => eq(rel.id, releaseId),
        with: {
          author: {
            columns: {
              email: true,
            },
          },
        },
      });

      if (!releaseData) {
        throw new Error("Нет релиза с такими данными");
      }

      await db
        .update(release)
        .set({ status: "approved", upc, rejectReason: null })
        .where(eq(release.id, releaseData.id));

      const transport = await createSMTPClient().catch(() => null);

      if (!transport) {
        throw new Error("Что-то пошло не так");
      }

      sendModerationNotification(
        releaseData.author.email,
        transport,
        "approved",
        releaseData.title
      );
    })
    .then(() => true)
    .catch(() => false);

  if (!isSuccess) {
    return { success: false, message: "Что-то пошло не так" };
  }

  return revalidateCurrentPath();
}

export async function rejectRelease(releaseId: string, reason: string) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return {
      success: false,
      message: "Недостаточно прав для выполнения действия",
    };
  }

  const isSuccess = await db
    .transaction(async () => {
      const releaseData = await db.query.release.findFirst({
        where: (rel, { eq }) => eq(rel.id, releaseId),
        with: {
          author: {
            columns: {
              email: true,
            },
          },
        },
      });

      if (!releaseData) {
        throw new Error("Нет релиза с такими данными");
      }

      await db
        .update(release)
        .set({ status: "rejected", rejectReason: reason })
        .where(eq(release.id, releaseData.id));

      const transport = await createSMTPClient().catch(() => null);

      if (!transport) {
        throw new Error("Что-то пошло не так");
      }

      await sendModerationNotification(
        releaseData.author.email,
        transport,
        "rejected",
        releaseData.title,
        reason
      );
    })
    .then(() => true)
    .catch(() => false);

  if (!isSuccess) {
    return { success: false, message: "Что-то пошло не так" };
  }

  return revalidateCurrentPath();
}
