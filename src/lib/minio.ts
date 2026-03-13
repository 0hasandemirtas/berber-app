import * as Minio from "minio";

const globalForMinio = globalThis as unknown as {
  minio: Minio.Client | undefined;
};

export const minioClient =
  globalForMinio.minio ??
  new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "localhost",
    port: Number(process.env.MINIO_PORT) || 9000,
    useSSL: process.env.MINIO_USE_SSL === "true",
    accessKey: process.env.MINIO_ACCESS_KEY || "",
    secretKey: process.env.MINIO_SECRET_KEY || "",
  });

if (process.env.NODE_ENV !== "production") globalForMinio.minio = minioClient;

export const BUCKET_NAME = process.env.MINIO_BUCKET || "berber-randevu";
