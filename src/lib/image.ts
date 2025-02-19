import { imageMeta } from "image-meta";
import { BUCKET_NAME, s3Client } from "@/lib/cloudflare";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

export async function imgUrlToBlob(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob.arrayBuffer();
}

export const uploadToCloudflare = async (image: string, userId: string) => {
  try {
    const arrayBuffer = await imgUrlToBlob(image);
    const { type } = imageMeta(new Uint8Array(arrayBuffer));
    const fileName = `image_${randomUUID()}.${type}`;
    const filePath = `${userId}/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: new Uint8Array(arrayBuffer),
        ContentType: "image/png",
      }),
    );

    return `${process.env.NEXT_PUBLIC_R2_URL}/${filePath}`;
  } catch (error) {
    console.error("Error uploading to Cloudflare:", error);
    throw new Error("Failed to upload image");
  }
};
