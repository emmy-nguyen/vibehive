"use server";
import { songs } from "@/db/schema/songs";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { db, desc, eq } from "@/db/index";

export async function getSongsByUser() {
  const session = await getServerSession(authOptions);
  if (!session) {
    console.log("User not found");
    return;
  }
  const userId = parseInt(session.user.id);
  const songsByUser = await db
    .select()
    .from(songs)
    .where(eq(songs.userId, userId))
    .orderBy(desc(songs.createdAt));
  return songsByUser;
}
