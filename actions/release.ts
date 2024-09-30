"use server";

import { minioS3 } from "@/config/s3";
// import { releaseServerSchema } from "@/schema/release.schema";

export async function uploadRelease(data: FormData) {
  const objectFromData: unknown = Object.fromEntries(data?.entries());

  // const success = releaseServerSchema.safeParse(objectFromData);

  // if (!success) {
  //   return { success: false };
  // }

  // const bucket = "example";
  // const isBucketExists = await minioS3.bucketExists(bucket).catch(() => false);
  // if (isBucketExists) {
  //   const encoder = new TextEncoder();
  //   const example_file = new File(["qwe123", "eqw123"], "qwe.txt", {});
  //   const fileBytes = await example_file.arrayBuffer();
  //   const fileName = "test.txt";
  //   const success = await minioS3
  //     .putObject(bucket, fileName, Buffer.from(fileBytes))
  //     .catch(() => false)
  //     .then(() => true);
  //   return { success };
  // }

  return { success: true };
}

export async function getTrack() {
  // const qwe = await minioS3.presignedGetObject(
  //   "example",
  //   "example/gitlabava.png",
  //   10 * 60
  // );
  // console.log(qwe);
  const bucket = "previews";

  const isBucketExists = await minioS3.bucketExists(bucket).catch(() => false);

  if (isBucketExists) {
    const example_file = new File(["qwe123", "eqw123"], "qwe.txt", {});

    const fileBytes = await example_file.arrayBuffer();

    const fileName = "test.txt";

    const success = await minioS3
      .putObject(bucket, fileName, Buffer.from(fileBytes))
      .catch(() => false)
      .then(() => true);

    return { success };
  }
}
