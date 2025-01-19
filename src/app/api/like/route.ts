import { and, db, eq } from "@/db";
import { liked } from "@/db/schema/liked";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, songId } = await req.json();
    if (!songId || !userId) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }
    await db
      .insert(liked)
      .values({ userId: Number(userId), songId: Number(songId) });
    return NextResponse.json({ message: "Like added successfully" });
  } catch (error) {
    console.error("Error adding like", error);
    return NextResponse.json({ message: "Error adding like" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, songId } = await req.json();
    if (!songId || !userId) {
      return NextResponse.json(
        { message: "Invalid request parameters" },
        { status: 400 }
      );
    }
    await db
      .delete(liked)
      .where(
        and(eq(liked.userId, Number(userId)), eq(liked.songId, Number(songId)))
      );
    return NextResponse.json({ message: "Like removed successfully" });
  } catch (error) {
    console.error("Error removing like", error);
    return NextResponse.json(
      { message: "Error removing like" },
      { status: 500 }
    );
  }
}
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
