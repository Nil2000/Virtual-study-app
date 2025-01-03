import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { access_token, device_id } = await req.json();
    await axios.request({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player/repeat?state=context",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      data: { device_id },
    });
    return NextResponse.json(
      { message: "Repeat context set" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
