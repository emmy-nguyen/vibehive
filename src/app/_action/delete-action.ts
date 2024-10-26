"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { and, db, eq } from "@/db/index";
import { songs } from "@/db/schema/songs";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
export async function deleteSong(songId: number) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { failure: "Not authenticated" };
  }
  await db.transaction(async (tx) => {
    const song = await tx
      .select()
      .from(songs)
      .where(
        and(eq(songs.id, songId), eq(songs.userId, parseInt(session.user.id)))
      )
      .then((res) => res[0]);

    if (!song) {
      return { failure: "Song not found" };
    }
    const songItem = await tx
      .delete(songs)
      .where(eq(songs.id, songId))
      .returning()
      .then((res) => res[0]);

    //delete from S3
    try {
      const deleteSongObjectCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: songItem.songPath.split("/").pop()!,
      });
      await s3.send(deleteSongObjectCommand);
    } catch (err) {
      console.error("Error deleting song from S3:", err);
    }
    if (song.imagePath) {
      try {
        const deleteImageObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: songItem.imagePath?.split("/").pop(),
        });

        await s3.send(deleteImageObjectCommand);
      } catch (err) {
        console.error("Error deleting image from S3:", err);
      }
    }
    console.log("delete", songId);
  });
}
