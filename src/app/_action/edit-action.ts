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

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export async function editSong(
  songId: number,
  newTitle: string,
  newArtist: string,
  newSongFile?: File,
  newImageFile?: File
) {
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

    // initialize the value of newSongPath and newImagePath
    let newSongPath = song.songPath;
    let newImagePath = song.imagePath;

    // check if there is a newSongFile
    if (newSongFile) {
      if (song.songPath) {
        // delete song file in S3 bucket
        const deleteSongObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: song.songPath.split("/").pop()!,
        });
        await s3.send(deleteSongObjectCommand);
      }
      // upload new song file to S3 bucket
      const songSignedURLResult = await getSignedURL({
        fileName: newSongFile.name,
        fileType: newSongFile.type,
        fileSize: newSongFile.size,
        checksum: await computeSHA256(newSongFile),
      });

      if (!songSignedURLResult.success) {
        console.error("Error to get songSignedURL");
        return { failure: "Error to get songSignedURL" };
      }

      // upload a new song to S3 bucket
      const songSignedURL = songSignedURLResult.success.url;
      await fetch(songSignedURL, {
        method: "PUT",
        body: newSongFile,
        headers: { "Content-Type": newSongFile.type },
      });
      newSongPath = songSignedURL.split("?")[0];
    }

    // check if there is a newImageFile
    if (newImageFile) {
      if (song.imagePath) {
        // delete image file in S3 bucket
        const deleteImageObjectCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: song.imagePath.split("/").pop()!,
        });
        await s3.send(deleteImageObjectCommand);
      }
      // upload new image file to S3 bucket
      const imageSignedURLResult = await getSignedURL({
        fileName: newImageFile.name,
        fileType: newImageFile.type,
        fileSize: newImageFile.size,
        checksum: await computeSHA256(newImageFile),
      });

      if (!imageSignedURLResult.success) {
        console.error("Error to get imageSignedURL");
        return { failure: "Error to get imageSignedURL" };
      }

      // upload a new image to S3 bucket
      const imageSignedURL = imageSignedURLResult.success.url;
      await fetch(imageSignedURL, {
        method: "PUT",
        body: newImageFile,
        headers: { "Content-Type": newImageFile.type },
      });
      newImagePath = imageSignedURL.split("?")[0];
    }

    // update song information in the database
    await tx
      .update(songs)
      .set({
        title: newTitle,
        artist: newArtist,
        songPath: newSongPath,
        imagePath: newImagePath,
      })
      .where(eq(songs.id, songId));
    return { success: "Song updated successfully" };
  });
}
