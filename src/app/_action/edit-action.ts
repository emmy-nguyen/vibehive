"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { and, db, eq } from "@/db/index";
import { songs } from "@/db/schema/songs";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedURL } from "./upload-action";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function editSong(
  songId: number,
  newTitle: string,
  newArtist: string,
  oldImagePath: string,
  oldSongPath: string,
  newSongPath?: string,
  newImagePath?: string
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { failure: "Not authenticated" };
  }

  if (!newSongPath && !newSongPath && !newTitle && !newArtist) {
    return { failure: "No field" };
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
      console.log("Song not found");
      return { failure: "Song not found" };
    }

    // delete old song and image from S3 bucket
    const deleteSongObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: oldSongPath.split("/").pop()!,
    });
    await s3.send(deleteSongObjectCommand);

    const deleteImageObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: oldImagePath.split("/").pop()!,
    });
    await s3.send(deleteImageObjectCommand);

    // update song information in the database
    const updatedFile = await tx
      .update(songs)
      .set({
        title: newTitle,
        artist: newArtist,
        songPath: newSongPath,
        imagePath: newImagePath,
      })
      .where(eq(songs.id, songId))
      .returning()
      .then((res) => res[0]);
    console.log("Song updated successfully", updatedFile);
    return { success: "Song updated successfully" };
  });
}
