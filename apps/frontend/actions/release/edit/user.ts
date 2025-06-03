"use server";

import { getAuthSession } from "@/actions/auth";
import { revalidatePathAction } from "@/actions/revalidate";
import { createS3Client } from "@/shared/config/s3";
import { db } from "db";
import { release, track } from "db/schema";
import { standardLabelName } from "@/shared/helpers/priceList";
import {
  releasePreviewSchema,
  releaseUpdateSchema,
  trackUpdateSchema,
  TReleaseUpdate,
  TTrackUpdate,
} from "@/schema/release.schema";
import { fileSchema } from "@/schema/shared.schema";
import { uploadFile } from "@/shared/utils/fuleUpload";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function editUserRelease(
  releaseData: TReleaseUpdate,
  releaseFiles: FormData,
  tracksData: TTrackUpdate[],
  ...tracksFiles: FormData[]
) {
  const session = await getAuthSession();

  if (!session) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const user = await db.query.users.findFirst({
    where: (user, { eq, and }) =>
      and(eq(user.isVerifiedAuthor, true), eq(user.id, session.id)),
  });

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
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
    where: (rel, { eq, and }) =>
      and(eq(rel.authorId, user.id), eq(rel.id, releaseResult.data.id)),
    with: { tracks: true },
  });

  if (!releaseDBData) {
    return {
      success: false,
      message: "У пользователя не существует релиза с предоставленными данными",
    };
  }

  if (releaseDBData.labelName === standardLabelName) {
    releaseResult.data.labelName = standardLabelName;
  }

  if (tracksData.length !== tracksFiles.length) {
    return {
      success: false,
      message: "Что-то пошло не так",
    };
  }

  const tracksResult = trackUpdateSchema.array().safeParse(tracksData);

  if (!tracksResult.success) {
    return {
      success: false,
      message: "Данные треков не прошли автоматическую проверку",
    };
  }

  const releaseTrackIDs = releaseDBData.tracks.map((track) => track.id);

  const areUserTracks = tracksData
    .map((track) => track.id)
    .every((id) => releaseTrackIDs.includes(id));

  if (!areUserTracks) {
    return {
      success: false,
      message: "Не все треки принадлежат пользователю",
    };
  }

  const transactionResult = await db
    .transaction(async (tx) => {
      const client = createS3Client();

      const { id, ...otherReleaseData } = releaseResult.data;

      const updatedRelease = (
        await tx
          .update(release)
          .set({ ...otherReleaseData, performer: null, feat: null })
          .where(eq(release.id, id))
          .returning({ id: release.id, preview: release.preview })
      ).pop();

      if (!updatedRelease) {
        throw new Error("Не удалось обновить данные релиза");
      }

      const releasePreview = releaseFiles.get("preview");

      if (!!updatedRelease.preview && releasePreview instanceof File) {
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

      for (
        let trackIndex = 0;
        trackIndex < tracksResult.data.length;
        trackIndex++
      ) {
        const { id, releaseId, ...trackDataForUpdate } =
          tracksResult.data[trackIndex];

        const dbTrack = releaseDBData.tracks.find((tr) => tr.id === id);

        if (!dbTrack?.text) {
          trackDataForUpdate.text = null;
        }

        if (!dbTrack?.text_sync) {
          trackDataForUpdate.text_sync = null;
        }

        if (!dbTrack?.video) {
          trackDataForUpdate.video = null;
        }

        if (!dbTrack?.video_shot) {
          trackDataForUpdate.video_shot = null;
        }

        const trackFile = tracksFiles[trackIndex].get("track");

        if (!!trackDataForUpdate.track && trackFile instanceof File) {
          const trackFileResult = fileSchema.safeParse(trackFile);

          if (!trackFileResult.success) {
            throw new Error(
              `Файл трека ${trackIndex + 1} не прошёл автоматическую проверку`,
              {
                cause: trackFileResult.error,
              }
            );
          }

          await uploadFile({
            bucket: "tracks",
            name: `${updatedRelease.id}.${trackDataForUpdate.track}`,
            file: trackFileResult.data,
            client,
          }).catch((e) => {
            throw new Error(
              `Не удалось обновить файл трека ${trackIndex + 1}`,
              { cause: e }
            );
          });
        }

        const textSyncFile = tracksFiles[trackIndex].get("text_sync");

        if (!!trackDataForUpdate.text_sync && textSyncFile instanceof File) {
          const textSyncFileResult = fileSchema.safeParse(textSyncFile);

          if (!textSyncFileResult.success) {
            throw new Error(
              `Файл текстовой синхронизации трека ${
                trackIndex + 1
              } не прошёл автоматическую проверку`,
              {
                cause: textSyncFileResult.error,
              }
            );
          }

          await uploadFile({
            bucket: "syncs",
            name: `${updatedRelease.id}.${trackDataForUpdate.text_sync}`,
            file: textSyncFileResult.data,
            client,
          }).catch((e) => {
            throw new Error(
              `Не удалось обновить текстовую синхронизацию трека ${
                trackIndex + 1
              }`,
              {
                cause: e,
              }
            );
          });
        }

        const ringtoneFile = tracksFiles[trackIndex].get("ringtone");

        if (!!trackDataForUpdate.ringtone && ringtoneFile instanceof File) {
          const ringtoneFileResult = fileSchema.safeParse(ringtoneFile);

          if (!ringtoneFileResult.success) {
            throw new Error(
              `Файл рингтона трека ${
                trackIndex + 1
              } не прошёл автоматическую проверку`,
              {
                cause: ringtoneFileResult.error,
              }
            );
          }

          await uploadFile({
            bucket: "ringtones",
            name: `${updatedRelease.id}.${trackDataForUpdate.ringtone}`,
            file: ringtoneFileResult.data,
            client,
          }).catch((e) => {
            throw new Error(
              `Не удалось обновить рингтон трека ${trackIndex + 1}`,
              { cause: e }
            );
          });
        }

        const videoFile = tracksFiles[trackIndex].get("video");

        if (!!trackDataForUpdate.video && videoFile instanceof File) {
          const videoFileResult = fileSchema.safeParse(videoFile);

          if (!videoFileResult.success) {
            throw new Error(
              `Файл видео трека ${
                trackIndex + 1
              } не прошёл автоматическую проверку`,
              {
                cause: videoFileResult.error,
              }
            );
          }

          await uploadFile({
            bucket: "videos",
            name: `${updatedRelease.id}.${trackDataForUpdate.video}`,
            file: videoFileResult.data,
            client,
          }).catch((e) => {
            throw new Error(
              `Не удалось обновить видео трека ${trackIndex + 1}`,
              { cause: e }
            );
          });
        }

        const videoShotFile = tracksFiles[trackIndex].get("video_shot");

        if (!!trackDataForUpdate.video_shot && videoShotFile instanceof File) {
          const videoShotFileResult = fileSchema.safeParse(videoShotFile);

          if (!videoShotFileResult.success) {
            throw new Error(
              `Файл видео-шота трека ${
                trackIndex + 1
              } не прошёл автоматическую проверку`,
              {
                cause: videoShotFileResult.error,
              }
            );
          }

          await uploadFile({
            bucket: "videos",
            name: `${updatedRelease.id}.${trackDataForUpdate.video_shot}`,
            file: videoShotFileResult.data,
            client,
          }).catch((e) => {
            throw new Error(
              `Не удалось обновить видео-шот трека ${trackIndex + 1}`,
              {
                cause: e,
              }
            );
          });
        }

        await tx
          .update(track)
          .set(trackDataForUpdate)
          .where(and(eq(track.id, id), eq(track.releaseId, releaseId)));
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

  await revalidatePathAction(`/dashboard/edit/${transactionResult.data.id}`);

  redirect(`/dashboard/edit/${transactionResult.data.id}`);
}
