import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();
    console.log("refreshToken :: ", refresh_token);

    if (!refresh_token) {
      return NextResponse.json(
        { error: "missing_refresh_token" },
        { status: 400 }
      );
    }

    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    return NextResponse.json(
      {
        ...data,
        refresh_token: data.refresh_token || refresh_token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in POST: ${error}`);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 400 }
    );
  }
}
