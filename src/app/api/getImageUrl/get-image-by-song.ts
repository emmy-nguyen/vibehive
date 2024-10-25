import { NextApiRequest, NextApiResponse } from "next";
import { db, eq } from "@/db/index";
import { songs } from "@/db/schema/songs";
import { Song } from "../../../../types";

export async function getImageBySong(song: Song) {
  if (!song) {
    console.log("Song not found");
    return;
  }
  const imageBySong = await db
    .select()
    .from(songs)
    .where(eq(songs.id, song.id));
  return imageBySong;
}
