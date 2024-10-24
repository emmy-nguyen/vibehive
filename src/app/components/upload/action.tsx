"use server";

import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "audio/mpeg",
];

const songMaxSize = 1024 * 1024 * 10; // 10MB
const imageMaxSize = 1024 * 1024 * 5; // 5MB

export async function getSignedURL({
  fileName,
  fileType,
  fileSize,
  checksum,
}: {
  fileName: string;
  fileType: string;
  fileSize: number;
  checksum: string;
}) {
  const session = await getServerSession();

  console.log(session, "from action");
  if (!session) {
    return { failure: "Not authenticated" };
  }

  if (!acceptedTypes.includes(fileType)) {
    return { failure: "Invalid file type" };
  }

  if (fileType.startsWith("image/") && fileSize > imageMaxSize) {
    return { failure: "Image size exceeds limit" };
  }

  if (fileType === "audio/mpeg" && fileSize > songMaxSize) {
    return { failure: "Song size exceeds limit" };
  }

  const pubObjCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
    // Metadata: {
    //   userId: session.user?.name,
    // },
  });

  const signedURL = await getSignedUrl(s3, pubObjCommand, {
    expiresIn: 60,
  });
  return { success: { url: signedURL } };
}
