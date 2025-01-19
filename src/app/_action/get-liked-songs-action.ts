"use server";
import { songs } from "@/db/schema/songs";
import { getServerSession } from "next-auth";
import { db, desc, eq } from "@/db/index";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { liked } from "@/db/schema/liked";

export async function getLikedSongs() {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("User not found");
    return;
  }

  try {
    const allLikedSongs = await db
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        imagePath: songs.imagePath,
        createdAt: liked.createdAt,
        songPath: songs.songPath,
        userId: songs.userId,
      })
      .from(liked)
      .innerJoin(songs, eq(liked.songId, songs.id))
      .where(eq(liked.userId, Number(session.user.id)))
      .orderBy(desc(liked.createdAt));
    if (allLikedSongs.length === 0) {
      return [];
    }
    return allLikedSongs;
  } catch (error) {
    console.error(error);
    return [];
  }
}
