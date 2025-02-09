"use server";

import { currentUser } from "@/lib/auth";
import { s3Client, BUCKET_NAME } from "@/lib/cloudflare";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedStorageUrl(filePath: string) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return { error: "Unauthorized" };
    }

    const path = `training/${user.id}/${new Date().getTime()}_${filePath}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    return {
      signedUrl,
      key: path,
      error: null,
    };
  } catch (error) {
    console.error("Error getting signed URL:", error);
    return { error: "Failed to generate upload URL" };
  }
}
