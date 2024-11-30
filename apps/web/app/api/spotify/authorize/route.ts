import { generateRandomString } from "@lib/spotify-token";
import { SPOTIFY_SCOPES } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Reached authorize route")
  try {
    const state = generateRandomString(16);
    const scope = SPOTIFY_SCOPES

    // res.cookies.set("spotify_auth_state", state)

    return NextResponse.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${process.env.SPOTIFY_API_REDIRECT_URI}&state=${state}`);

    // return NextResponse.json({
    //   redirect_uri: `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${scope}&redirect_uri=${process.env.SPOTIFY_API_REDIRECT_URI}&state=${state}`
    // }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET: ${error}`)
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}