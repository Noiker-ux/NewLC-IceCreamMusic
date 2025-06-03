import { Client } from "minio";

export function createS3Client() {
  const minioS3Options = {
    endPoint: process.env.S3_HOST as string,
    port: Number(process.env.S3_PORT),
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY as string,
    secretKey: process.env.S3_SECRET_KEY as string,
  };

  return new Client(minioS3Options);
}
