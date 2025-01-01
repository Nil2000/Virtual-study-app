import { getSpotifyToken } from "@lib/spotify-token";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { playlistId, access_token } = await req.json();

  // console.log(playlistId)
  if (!playlistId) {
    return NextResponse.json(
      { message: "Playlist ID is required" },
      { status: 400 }
    );
  }

  if (!access_token) {
    return NextResponse.json(
      { message: "Failed to get token" },
      { status: 500 }
    );
  }

  //retrieve playlist from Spotify API using token
  try {
    const res = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const tracks = res.data.tracks.items.map((track: any) => {
      return {
        name: track.track.name,
        artist: track.track.artists
          .map((artist: any) => artist.name)
          .join(", "),
        id: track.track.id,
        image: track.track.album.images[0].url,
      };
    });
    return NextResponse.json(
      {
        playListName: res.data.name,
        tracks: tracks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting playlist", error);
    return NextResponse.json(
      { message: "Error getting playlist" },
      { status: 500 }
    );
  }
}
