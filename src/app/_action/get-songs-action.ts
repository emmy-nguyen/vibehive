"use server";
import { songs } from "@/db/schema/songs";
import { getServerSession } from "next-auth";
import { db, desc, eq } from "@/db/index";
import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getSongs() {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("User not found");
    return;
  }
  const allSongs = await db.select().from(songs).orderBy(desc(songs.createdAt));
  return allSongs;
}
