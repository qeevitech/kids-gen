import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, BUCKET_NAME } from "./cloudflare";

export async function uploadAsset(file: File, userId: string) {
  const key = `${userId}/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: new Uint8Array(await file.arrayBuffer()),
    ContentType: file.type,
  });

  await r2.send(command);

  // Generate public URL
  const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

  return {
    key,
    url,
    filename: file.name,
    size: file.size,
    mimeType: file.type,
  };
}

export async function getSignedAssetUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2, command, { expiresIn: 3600 }); // 1 hour
}
