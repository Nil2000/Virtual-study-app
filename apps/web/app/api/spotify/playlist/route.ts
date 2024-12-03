import { getSpotifyToken } from "@lib/spotify-token";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const playlistId = req.nextUrl.searchParams.get("playlistId");
  console.log(playlistId)
  if (!playlistId) {
    return NextResponse.json({ message: "Playlist ID is required" }, { status: 400 });
  }

  //retrieve token from Spotify API
  // const token = await fetch("https://accounts.spotify.com/api/token", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   },
  //   body: 'grant_type=client_credentials&client_id=' + process.env.SPOTIFY_CLIENT_ID + '&client_secret=' + process.env.SPOTIFY_CLIENT_SECRET
  // })
  //   .then((res) => res.json()).catch((err) => {
  //     console.error(err);
  //     return NextResponse.json({ message: "Failed to get token" }, { status: 500 });
  //   })

  const accessToken = await getSpotifyToken();
  console.log("SPOTIFY_PLAYLIST_ROUTE")
  console.log(accessToken);

  if (!accessToken) {
    return NextResponse.json({ message: "Failed to get token" }, { status: 500 });
  }

  //retrieve playlist from Spotify API using token
  const playlist = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json()).catch((err) => {
    console.error(err);
    return NextResponse.json({ message: "Failed to get playlist" }, { status: 500 });
  })

  console.log(playlist)

  const processedTracks = playlist.tracks.items.map((item: any) => {
    return {
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((artist: any) => artist.name),
      album: item.track.album.name,
      duration_ms: item.track.duration_ms,
    };
  })

  return NextResponse.json(processedTracks, { status: 200 });
}