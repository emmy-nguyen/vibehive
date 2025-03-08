import { getSongById } from "@/app/_action/get-song-by-id-action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Invalid songId" }, { status: 400 });
  }
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    return NextResponse.json(
      { error: "Invalid song Id format" },
      { status: 400 }
    );
  }
  try {
    const song = await getSongById(id);
    if (!song) {
      return NextResponse.json({ message: "Song not found" }, { status: 404 });
    }
    return NextResponse.json(song, { status: 200 });
  } catch (error) {
    console.log("Error fetching song", error);
    return NextResponse.json(
      { message: "Error fetching song" },
      { status: 500 }
    );
  }
}
