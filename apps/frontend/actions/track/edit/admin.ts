"use server";

import { revalidatePathAction } from "@/actions/revalidate";
import { isAdminUser } from "@/actions/users";
import { createS3Client } from "@/shared/config/s3";
import { db } from "db";
import { track } from "db/schema";
import {
  optionalFileSchema,
  trackUpdateSchema,
  TTrackUpdate,
} from "@/schema/release.schema";
import { fileSchema } from "@/schema/shared.schema";
import { uploadFile } from "@/shared/utils/fuleUpload";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function editAdminTrack(
  trackData: TTrackUpdate,
  trackFiles: FormData
) {
  const client = createS3Client();

  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    return { success: false as const, message: "Unauthorized" };
  }

  const validatedTrackData = await trackUpdateSchema.safeParse(trackData);

  if (!validatedTrackData.success) {
    return {
      success: false as const,
      message: "Данные трека не прошли автоматическую проверку",
    };
  }

  const dbTrackData = await db.query.track.findFirst({
    where: (trk, { eq, and }) =>
      and(
        eq(trk.id, validatedTrackData.data.id),
        eq(trk.releaseId, validatedTrackData.data.releaseId)
      ),
  });

  if (!dbTrackData) {
    return { success: false, message: "Трек не найден" };
  }

  const transactionResult = await db
    .transaction(async (tx) => {
      const { id, ...otherTrackData } = validatedTrackData.data;

      const updatedTrack = (
        await tx
          .update(track)
          .set(otherTrackData)
          .where(eq(track.id, dbTrackData.id))
          .returning({
            id: track.id,
            track: track.track,
            text_sync: track.text_sync,
            ringtone: track.ringtone,
            video: track.video,
            video_shot: track.video_shot,
          })
      ).pop();

      if (!updatedTrack) {
        throw new Error("Что-то пошло не так");
      }

      const trackFile = trackFiles.get("track");

      if (!!updatedTrack.track && trackFile instanceof File) {
        const trackFileResult = fileSchema.safeParse(trackFile);

        if (!trackFileResult.success) {
          throw new Error("Файл трека не прошёл автоматическую проверку", {
            cause: trackFileResult.error,
          });
        }

        await uploadFile({
          bucket: "tracks",
          name: `${updatedTrack.id}.${updatedTrack.track}`,
          file: trackFileResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить файл трека", { cause: e });
        });
      }

      const ringtoneFile = trackFiles.get("ringtone");

      if (!!updatedTrack.ringtone && ringtoneFile instanceof File) {
        const ringtoneFileResult = optionalFileSchema.safeParse(ringtoneFile);

        if (
          !ringtoneFileResult.success ||
          !(ringtoneFileResult.data instanceof File)
        ) {
          throw new Error("Файл трека не прошёл автоматическую проверку", {
            cause: ringtoneFileResult.error,
          });
        }

        await uploadFile({
          bucket: "ringtones",
          name: `${updatedTrack.id}.${updatedTrack.ringtone}`,
          file: ringtoneFileResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить рингтон трека", { cause: e });
        });
      }

      const textSyncFile = trackFiles.get("text_sync");

      if (!!updatedTrack.text_sync && ringtoneFile instanceof File) {
        const textSyncFileResult = optionalFileSchema.safeParse(textSyncFile);

        if (
          !textSyncFileResult.success ||
          !(textSyncFileResult.data instanceof File)
        ) {
          throw new Error(
            "Файл синхронизации не прошёл автоматическую проверку",
            { cause: textSyncFileResult.error }
          );
        }

        await uploadFile({
          bucket: "syncs",
          name: `${updatedTrack.id}.${updatedTrack.text_sync}`,
          file: textSyncFileResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить рингтон трека", { cause: e });
        });
      }

      const videoFile = trackFiles.get("video");

      if (!!updatedTrack.video && videoFile instanceof File) {
        const videoFileResult = optionalFileSchema.safeParse(videoFile);

        if (
          !videoFileResult.success ||
          !(videoFileResult.data instanceof File)
        ) {
          throw new Error("Файл видео не прошёл автоматическую проверку", {
            cause: videoFileResult.error,
          });
        }

        await uploadFile({
          bucket: "videos",
          name: `${updatedTrack.id}.${updatedTrack.video}`,
          file: videoFileResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить видео трека", { cause: e });
        });
      }

      const videoShotFile = trackFiles.get("video_shot");

      if (!!updatedTrack.video_shot && videoShotFile instanceof File) {
        const videoShotFileResult = optionalFileSchema.safeParse(videoShotFile);

        if (
          !videoShotFileResult.success ||
          !(videoShotFileResult.data instanceof File)
        ) {
          throw new Error("Файл видео-шота не прошёл автоматическую проверку", {
            cause: videoShotFileResult.error,
          });
        }

        await uploadFile({
          bucket: "videoshots",
          name: `${updatedTrack.id}.${updatedTrack.video_shot}`,
          file: videoShotFileResult.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось обновить видео-шот трека", { cause: e });
        });
      }

      return { success: true as const, data: updatedTrack };
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
