"use server";
import { songs } from "@/db/schema/songs";
import { getServerSession } from "next-auth";
import { db, desc, eq } from "@/db/index";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getSongs } from "./get-songs-action";

export async function getSongsByTitle(title: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log("User not found");
      return;
    }

    if (!title) {
      const allSongs = await getSongs();
      return allSongs;
    }
    const songsByTitle = await db
      .select()
      .from(songs)
      .where(eq(songs.title, title))
      .orderBy(desc(songs.createdAt));
    return songsByTitle;
  } catch (error) {
    console.error(error);
    return [];
  }
}
