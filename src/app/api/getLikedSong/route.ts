import { and, db, eq } from "@/db";
import { liked } from "@/db/schema/liked";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = Number(searchParams.get("userId"));
  const songId = Number(searchParams.get("songId"));

  if (!userId || !songId) {
    return NextResponse.json(
      { message: "Invalid request parameters" },
      { status: 400 }
    );
  }

  const result = await db
    .select()
    .from(liked)
    .where(and(eq(liked.userId, userId), eq(liked.songId, songId)));

  return NextResponse.json({ liked: result.length > 0 });
}
