"use server";

import { revalidatePathAction } from "@/actions/revalidate";
import { isAdminUser } from "@/actions/users";
import { createS3Client } from "@/shared/config/s3";
import { db } from "db";
import { release } from "db/schema";
import {
  releasePreviewSchema,
  releaseUpdateSchema,
  TReleaseUpdate,
} from "@/schema/release.schema";
import { uploadFile } from "@/shared/utils/fuleUpload";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function editAdminRelease(
  releaseData: TReleaseUpdate,
  releaseFiles: FormData
) {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false, message: "Forbidden" };
  }

  const releaseResult = releaseUpdateSchema.safeParse(releaseData);

  if (!releaseResult.success) {
    console.dir(releaseResult.error, { depth: Infinity });
    return {
      success: false,
      message: "Данные релиза не прошли автоматическую проверку",
    };
  }

  const releaseDBData = await db.query.release.findFirst({
    where: (rel, { eq }) => eq(rel.id, releaseResult.data.id),
  });

  if (!releaseDBData) {
    return {
      success: false,
      message: "У пользователя не существует релиза с предоставленными данными",
    };
  }

  const transactionResult = await db
    .transaction(async (tx) => {
      const client = createS3Client();

      const { id, ...otherReleaseData } = releaseResult.data;

      const updatedRelease = (
        await tx
          .update(release)
          .set(otherReleaseData)
          .where(eq(release.id, id))
          .returning({ id: release.id, preview: release.preview })
      ).pop();

      if (!updatedRelease) {
        throw new Error("Не удалось обновить данные релиза");
      }

      const releasePreview = releaseFiles.get("preview");

      if (!!updatedRelease.preview && !!releasePreview) {
        const releasePreviewResult =
          releasePreviewSchema.safeParse(releasePreview);

        if (!releasePreviewResult.success) {
          throw new Error(
            "Файл обложки релиза не прошёл автоматическую проверку",
            { cause: releasePreviewResult.error }
          );
        }

        await uploadFile({
          bucket: "previews",
          name: `${updatedRelease.id}.${updatedRelease.preview}`,
          file: releasePreviewResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить обложку релиза", { cause: e });
        });
      }

      return { success: true as const, data: updatedRelease };
    })
    .catch((e: Error) => {
      console.dir(
        { date: new Date(), error: e.cause, message: e.message },
        { depth: Infinity }
      );
      return {
        success: false as const,
        message: e.message,
      };
    });

  if (!transactionResult.success) {
    return transactionResult;
  }

  await revalidatePathAction("");

  redirect("");
}
