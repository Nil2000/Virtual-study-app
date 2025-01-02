import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { access_token, device_id } = await req.json();
    // await fetch("https://api.spotify.com/v1/me/player/repeat", {
    //   method: "PUT",
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ device_id, state: "context" }),
    // });
    // await axios.request({
    //   method: "PUT",
    //   url: "https://api.spotify.com/v1/me/player/repeat",
    //   headers: {
    //     Authorization: `Bearer ${access_token}`,
    //     "Content-Type": "application/json",
    //   },
    //   data: { device_id, state: "context" },
    // });
    await axios.put(
      "https://api.spotify.com/v1/me/player/repeat",
      { device_id, state: "context" },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
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
