import { getSpotifyToken } from "@lib/spotify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getSpotifyToken();

  if (!token) {
    return new NextResponse("Failed to get token", { status: 500 });
  }

  return NextResponse.json(token, { status: 200 });
}