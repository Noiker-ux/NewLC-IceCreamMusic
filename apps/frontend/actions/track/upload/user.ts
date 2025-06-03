"use server";
import { getAuthSession } from "@/actions/auth";
import { revalidatePathAction } from "@/actions/revalidate";
import { redirect } from "next/navigation";
import {
  optionalFileSchema,
  trackInsertSchema,
  TTrackInsert,
} from "@/schema/release.schema";
import { db } from "db";
import { createS3Client } from "@/shared/config/s3";
import { track } from "db/schema";
import { removeFile, uploadFile } from "@/shared/utils/fuleUpload";
import { fileSchema } from "@/schema/shared.schema";

export async function uploadUserTrack(
  trackData: TTrackInsert,
  trackFiles: FormData,
  releaseId: string
) {
  const session = await getAuthSession();

  if (!session) {
    return {
      success: false as const,
      message: "Unauthorized",
    };
  }

  const user = await db.query.users.findFirst({
    where: (user, { eq, and }) =>
      and(eq(user.isVerifiedAuthor, true), eq(user.id, session.id)),
  });

  if (!user) {
    return {
      success: false as const,
      message: "Unauthorized",
    };
  }

  const release = await db.query.release.findFirst({
    where: (rel, { eq, and }) =>
      and(eq(rel.authorId, user.id), eq(rel.id, releaseId)),
    with: { tracks: true },
  });

  if (!release) {
    return {
      success: false as const,
      message: "Релиз не найден",
    };
  }

  const validatedTrackData = trackInsertSchema.safeParse(trackData);

  if (!validatedTrackData.success) {
    return {
      success: false as const,
      message: "Данные трека не прошли автоматическую проверку",
    };
  }

  validatedTrackData.data.text = undefined;
  validatedTrackData.data.text_sync = undefined;
  validatedTrackData.data.video = undefined;
  validatedTrackData.data.video_shot = undefined;

  const transactionResult = await db
    .transaction(async (tx) => {
      const client = createS3Client();

      const insertedTrack = (
        await tx
          .insert(track)
          .values({
            ...validatedTrackData.data,
            releaseId,
            index: release.tracks.length,
          })
          .returning({
            id: track.id,
            track: track.track,
            ringtone: track.ringtone,
          })
      ).pop();

      if (!insertedTrack) {
        throw new Error("Не удалось сохранить данные трека");
      }

      const validatedTrackFile = fileSchema.safeParse(trackFiles.get("track"));

      if (validatedTrackFile.success) {
        await uploadFile({
          bucket: "tracks",
          name: `${insertedTrack.id}.${insertedTrack.track}`,
          file: validatedTrackFile.data,
          client,
        }).catch((e) => {
          throw new Error("Не удалось загрузить файл трека", { cause: e });
        });
      }

      const validatedRingtoneFile = optionalFileSchema.safeParse(
        trackFiles.get("ringtone")
      );

      if (validatedRingtoneFile.success && validatedRingtoneFile.data) {
        await uploadFile({
          bucket: "ringtones",
          name: `${insertedTrack.id}.${insertedTrack.ringtone}`,
          file: validatedRingtoneFile.data,
          client,
        }).catch(async (e) => {
          await removeTrackAssets(insertedTrack);
          throw new Error("Не удалось загрузить файл рингтона", {
            cause: e,
          });
        });
      }

      return { success: true as const };
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

  await revalidatePathAction(`/dashboard/edit/${release.id}`);

  redirect(`/dashboard/edit/${release.id}`);
}

async function removeTrackAssets(trackData: {
  id: string;
  track: string;
  ringtone: string | null;
}) {
  const client = createS3Client();
  await removeFile({
    bucket: "tracks",
    name: `${trackData.id}.${trackData.track}`,
    client,
  });
  await removeFile({
    bucket: "ringtones",
    name: `${trackData.id}.${trackData.ringtone}`,
    client,
  });
}
