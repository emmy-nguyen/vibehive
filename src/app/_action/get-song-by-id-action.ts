"use server";
import { songs } from "@/db/schema/songs";
import { getServerSession } from "next-auth";
import { db, desc, eq } from "@/db/index";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getSongById(id: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("User not found");
    return;
  }
  const songId = Number(id);
  if (isNaN(songId)) {
    throw new Error("Invalid song ID");
  }
  const songById = await db
    .select()
    .from(songs)
    .where(eq(songs.id, songId))
    .orderBy(desc(songs.createdAt));
  return songById;
}
