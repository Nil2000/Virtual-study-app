import axios from "axios";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { access_token, device_id } = await req.json();
    await axios.put(
      "https://api.spotify.com/v1/me/player/repeat?state=context",
      {
        device_id: device_id,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    return NextResponse.json(
      { message: "Repeat context set" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
