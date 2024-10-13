"use server";

import { minioS3 } from "@/config/s3";
import { db } from "@/db";
import { release, track } from "@/db/schema";
import {
  releaseFormSchema,
  trackFormSchema,
  TReleaseForm,
  TReleaseInsert,
} from "@/schema/release.schema";
import { randomUUID } from "crypto";
import { ZodError } from "zod";
import { getAuthSession } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePathAction } from "./revalidate";

export async function uploadRelease(
  releaseData: FormData,
  ...tracksData: FormData[]
) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, session.user!.id),
  });

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const releaseObjectProto = await new Promise((res, rej) => {
    try {
      res({
        ...Object.fromEntries(releaseData.entries()),
        preview: releaseData.get("preview"),
        area: JSON.parse(String(releaseData.get("area") ?? "")),
        platforms: JSON.parse(String(releaseData.get("platforms") ?? "")),
      });
    } catch (e) {
      rej(null);
    }
  }).catch(() => {});

  const releaseResult = releaseFormSchema
    .omit({ tracks: true })
    .safeParse(releaseObjectProto);

  if (!releaseResult.success) {
    return {
      success: false,
      message: "Release is not valid. Please resend form",
    };
  }

  const tracksObjectsData = await Promise.all(
    tracksData.map(async (td) => {
      const trackSync = td.get("text_sync");
      const ringtone = td.get("ringtone");
      const video = td.get("video");
      const track = td.get("track");
      const video_shot = td.get("video_shot");

      return trackFormSchema.parse({
        ...Object.fromEntries(td.entries()),
        roles: JSON.parse(String(td.get("roles") ?? "")),
        track: track,
        text_sync: !!trackSync ? trackSync : undefined,
        ringtone: !!ringtone ? ringtone : undefined,
        video: !!video ? video : undefined,
        focus: !!td.get("focus"),
        explicit: !!td.get("explicit"),
        cover: !!td.get("cover"),
        remix: !!td.get("remix"),
        instrumental: !!td.get("instrumental"),
        video_shot: !!video_shot ? video_shot : undefined,
      });
    })
  ).catch((e: ZodError<TReleaseForm>) => null);

  if (!tracksObjectsData) {
    return {
      success: false,
      message: "Tracks are not valid please resend form",
    };
  }

  const releaseId = randomUUID();

  const releaseFile = releaseResult.data.preview as File;

  const previewBytes = await releaseFile.arrayBuffer();

  const previewType = releaseFile.type.split("/")[1];

  const previewUploaded = await minioS3
    .putObject(
      "previews",
      `${releaseId}.${previewType}`,
      Buffer.from(previewBytes)
    )
    .then(() => true)
    .catch(() => false);

  if (!previewUploaded) {
    return {
      success: false,
      message: "Preview is not valid please resend form",
    };
  }

  releaseResult.data.preview = previewType;

  const tracksUploadInfo = tracksObjectsData.map((t) => {
    const trackId = randomUUID();
    return { ...t, id: trackId, releaseId };
  });

  const tracksUploaded = await Promise.all(
    tracksUploadInfo.map(async (t) => {
      const trackFile = t.track as File;

      const trackBytes = await trackFile.arrayBuffer();

      const trackType = trackFile.type.split("/")[1];

      const trackUploaded = await minioS3
        .putObject("tracks", `${t.id}.${trackType}`, Buffer.from(trackBytes))
        .then(() => true);

      if (trackUploaded) {
        t.track = trackType;
      }

      if (t.text_sync) {
        const syncFile = t.text_sync as File;

        const syncBytes = await syncFile.arrayBuffer();

        const syncType = syncFile.type.split("/")[1];

        const syncUploaded = await minioS3
          .putObject("syncs", `${t.id}.${syncType}`, Buffer.from(syncBytes))
          .then(() => true)
          .catch(() => false);

        if (syncUploaded) {
          t.text_sync = syncType;
        }
      }

      if (t.ringtone) {
        const ringtoneFile = t.ringtone as File;

        const ringtoneBytes = await ringtoneFile.arrayBuffer();

        const ringtoneType = ringtoneFile.type.split("/")[1];

        const ringtoneUploaded = await minioS3
          .putObject(
            "ringtones",
            `${t.id}.${ringtoneType}`,
            Buffer.from(ringtoneBytes)
          )
          .then(() => true)
          .catch(() => false);

        if (ringtoneUploaded) {
          t.ringtone = ringtoneType;
        }
      }

      if (t.video) {
        const videoFile = t.video as File;

        const videoBytes = await videoFile.arrayBuffer();

        const videoType = videoFile.type.split("/")[1];

        const videoUploaded = await minioS3
          .putObject("videos", `${t.id}.${videoType}`, Buffer.from(videoBytes))
          .then(() => true)
          .catch(() => false);

        if (videoUploaded) {
          t.video = videoType;
        }
      }

      if (t.video_shot) {
        const videoFile = t.video_shot as File;

        const videoShotBytes = await videoFile.arrayBuffer();

        const videoShotType = videoFile.type.split("/")[1];

        const videoShotUploaded = await minioS3
          .putObject(
            "videoshots",
            `${t.id}.${videoShotType}`,
            Buffer.from(videoShotBytes)
          )
          .then(() => true)
          .catch(() => false);

        if (videoShotUploaded) {
          t.video_shot = videoShotType;
        }
      }

      return { ...t };
    })
  ).catch(() => null);

  if (!tracksUploaded) {
    return {
      success: false,
      message: "Tracks are not valid please resend form",
    };
  }

  const newRelease: TReleaseInsert = {
    ...releaseResult.data,
    authorId: user.id,
    preview: releaseResult.data.preview!,
    releaseDate: new Date(releaseResult.data.releaseDate),
    startDate: new Date(releaseResult.data.startDate),
    preorderDate: new Date(releaseResult.data.preorderDate),
    confirmed: user.freeReleases > 0,
  };

  // TODO добавить изменение количества оставшихся релизов

  const succeded = await db
    .transaction(async () => {
      await db.insert(release).values(newRelease);
      await db.insert(track).values([
        ...tracksUploaded.map((t) => ({
          ...t,
          track: t.track!,
          instant_gratification: t.instant_gratification
            ? new Date(t.instant_gratification)
            : null,
        })),
      ]);
    })
    .then(() => true)
    .catch(() => false);

  if (!succeded) {
    return { success: false, message: "Something went wrong" };
  }

  revalidatePathAction("/dashboard");

  redirect("/dashboard");
}
