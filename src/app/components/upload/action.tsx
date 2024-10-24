"use server";

import { getServerSession } from "next-auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { and, db, eq } from "@/db/index";
import { songs } from "@/db/schema/songs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  const session = await getServerSession(authOptions);

  console.log(session, "from action");
  if (!session) {
    return { failure: true, message: "Not authenticated" };
  }

  if (!acceptedTypes.includes(fileType)) {
    return { failure: true, message: "Invalid file type" };
  }

  if (fileType.startsWith("image/") && fileSize > imageMaxSize) {
    return { failure: true, message: "Image size exceeds limit" };
  }

  if (fileType === "audio/mpeg" && fileSize > songMaxSize) {
    return { failure: true, message: "Song size exceeds limit" };
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

// function uploadFile
type UploadFileArgs = {
  title: string;
  artist: string;
  songPath: string;
  imagePath: string;
};
export async function uploadFile({
  title,
  artist,
  songPath,
  imagePath,
}: UploadFileArgs) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { failure: true, message: "Not authenticated" };
  }

  if (!songPath && !imagePath && !title && !artist) {
    return { failure: true, message: "No file to upload" };
  }
  const uploadedFile = await db
    .insert(songs)
    .values({
      title: title,
      artist: artist,
      songPath: songPath,
      imagePath: imagePath,
      userId: Number(session.user?.id),
      createdAt: new Date(),
    })
    .returning()
    .then((res) => res[0]);

  revalidatePath("/");
  redirect("/");
}
