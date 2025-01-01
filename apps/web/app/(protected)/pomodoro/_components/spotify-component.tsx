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
}: SpotifyComponentProps) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute w-full h-full bg-opacity-10 z-10 flex justify-center items-center">
        <Link href={generateSpotifyAuthURL()}>
          <Button>
            <FaSpotify />
            Connect Spotify
          </Button>
        </Link>
      </div>
      <Card
        className={`border shadow-md p-4 space-y-2 h-max ${isLoggedIn ? "" : "blur"}`}
      >
        <CardHeader className="text-3xl font-bold text-center">
          Spotify
        </CardHeader>
        <CardDescription className="flex justify-center">
          <SongCard track={dummySong} />
        </CardDescription>
        <CardFooter />
      </Card>
    </div>
  );
}
