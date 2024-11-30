import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Reached callback route")
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  // const storedState = req.cookies.get("spotify_auth_state");

  if (!state) {
    return NextResponse.json({ error: 'state_mismatch' }, { status: 400 });
  }

  // if (state !== storedState?.value) {
  //   return NextResponse.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }).toString());
  // }

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", {
      code,
      redirect_uri: process.env.SPOTIFY_API_REDIRECT_URI,
      grant_type: "authorization_code"
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      }
    })

    console.log(response.data);

    if (response.status !== 200) {
      return NextResponse.json({ error: 'invalid_token' }, { status: 400 });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error(`Error in token exhange: ${error}`)
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}