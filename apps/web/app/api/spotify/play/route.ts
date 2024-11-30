import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { playlist_id, access_token, device_id } = await req.json();

    const res = await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      context_uri: `spotify:playlist:${playlist_id}`,
      offset: { position: 0 },
      position_ms: 0
    }, { headers: { Authorization: `Bearer ${access_token}` } });

    return NextResponse.json(res.data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, {
      status: 400
    });
  }
}