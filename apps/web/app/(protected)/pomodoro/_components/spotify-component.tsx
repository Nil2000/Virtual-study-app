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
import Script from "next/script";
import ChangePlayListDialog from "./change-playlist-dialog";

interface SpotifyComponentProps {
  isLoggedIn: boolean;
  currentPlaying: any;
  changePlaylist: any;
  generateSpotifyAuthURL: () => string;
  playListInfo: any;
  isPlaying: boolean;
}

export default function SpotifyComponent({
  isLoggedIn,
  currentPlaying,
  changePlaylist,
  generateSpotifyAuthURL,
  playListInfo,
  isPlaying,
}: SpotifyComponentProps) {
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
            {playListInfo && (
              <h2 className="text-center text-foreground text-base">
                Selected Playlist : {playListInfo.playListName}
              </h2>
            )}
            <SongCard track={currentPlaying} />
            <ChangePlayListDialog
              changePlayList={changePlaylist}
              disabled={isPlaying}
            />
          </div>
        </CardDescription>
        <CardFooter />
      </Card>
    </div>
  );
}
