import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { songs } from "@/db/schema/songs";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "Invalid imageId" }, { status: 400 });
  }

  try {
    const result = await db
      .select()
      .from(songs)
      .where(eq(songs.id, parseInt(id)))
      .limit(1);

    console.log("getImageUrl", JSON.stringify(result, null, 2));
    if (result.length > 0) {
      return NextResponse.json({ url: result[0].imagePath });
    } else {
      return NextResponse.json({ message: "Song not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Error fetching image URL" },
      { status: 500 }
    );
  }
}
