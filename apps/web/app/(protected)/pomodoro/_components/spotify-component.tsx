import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import Link from "next/link";
import React from "react";
import { FaSpotify } from "react-icons/fa";
import SongCard from "./song-card";
import axios from "axios";
import Script from "next/script";

const dummySong = {
  id: "1",
  name: "Shape of You",
  artists: ["Ed Sheeran"],
  album: "÷ (Deluxe)",
  duration_ms: 233713,
};

interface SpotifyComponentProps {
  isLoggedIn: boolean;
  currentPlaying: any;
  changeVolume: any;
  changePlaylist: any;
  generateSpotifyAuthURL: () => string;
  muted: boolean;
  pause: () => void;
  play: () => void;
  stop: () => void;
  start: () => void;
  currentPlaylistId: string;
}

export default function SpotifyComponent({
  isLoggedIn,
  currentPlaying,
  changeVolume,
  changePlaylist,
  generateSpotifyAuthURL,
  muted,
  pause,
  play,
  stop,
  start,
  currentPlaylistId,
}: SpotifyComponentProps) {
  const getPlayListDetails = async (playlistId: string) => {
    if (!localStorage.getItem("spotify_access_token")) {
      return;
    }
    try {
      const res = await axios.post(`/api/spotify/playlist/`, {
        playlistId,
        access_token: localStorage.getItem("spotify_access_token"),
      });
      console.log(res.data);
      changePlaylist(playlistId);
    } catch (error) {
      console.error("Error getting playlist details", error);
    }
  };

  React.useEffect(() => {
    if (currentPlaylistId) {
      getPlayListDetails(currentPlaylistId);
    }
  }, [currentPlaylistId]);

  return (
    <div className="relative w-full h-full">
      {!isLoggedIn && (
        <div className="absolute w-full h-full bg-opacity-10 z-10 flex justify-center items-center">
          <Link href={generateSpotifyAuthURL()}>
            <Button>
              <FaSpotify />
              Connect Spotify
            </Button>
          </Link>
        </div>
      )}
      {isLoggedIn && <Script src="https://sdk.scdn.co/spotify-player.js" />}
      <Card
        className={`border shadow-md p-4 space-y-2 h-full ${isLoggedIn ? "" : "blur"}`}
      >
        <CardHeader className="text-3xl font-bold text-center">
          Currently Playing
        </CardHeader>
        <CardDescription className="flex justify-center">
          <div className="flex flex-col gap-4">
            {/* <SongCard track={currentPlaying} /> */}
            <Button>Change Playlist</Button>
          </div>
        </CardDescription>
        <CardFooter />
      </Card>
    </div>
  );
}
