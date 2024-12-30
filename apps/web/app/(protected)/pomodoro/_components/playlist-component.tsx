"use client";
import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";
import React, { useEffect } from "react";
import DialogComponent from "./dialog-component";
import SongCard from "./song-card";
import { Track } from "@lib/types";
import SongsMarquee from "./songs-marquee";
import { PulseLoader } from "react-spinners";
import { useTheme } from "@repo/ui/index";
import { set } from "zod";

const mockTracks: Track[] = [
  {
    id: "1",
    name: "Shape of You",
    artists: ["Ed Sheeran"],
    album: "÷ (Deluxe)",
    duration_ms: 233713,
  },
  {
    id: "2",
    name: "Blinding Lights",
    artists: ["The Weeknd"],
    album: "After Hours",
    duration_ms: 200040,
  },
  {
    id: "3",
    name: "Dance Monkey",
    artists: ["Tones and I"],
    album: "The Kids Are Coming",
    duration_ms: 209325,
  },
  {
    id: "4",
    name: "Someone You Loved",
    artists: ["Lewis Capaldi"],
    album: "Divinely Uninspired to a Hellish Extent",
    duration_ms: 182160,
  },
  {
    id: "5",
    name: "Watermelon Sugar",
    artists: ["Harry Styles"],
    album: "Fine Line",
    duration_ms: 174000,
  },
];

export default function Playlist({
  setPlaylistId,
}: {
  setPlaylistId: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<string | undefined>(
    localStorage.getItem("spotify_playlist_id") || "37i9dQZEVXcLPx3yizROuf"
  );
  const [tracks, setTracks] = React.useState<Track[] | undefined>(undefined);
  const { theme } = useTheme();

  const fetchData = async () => {
    const fetchPlaylist = await fetch(
      "/api/spotify/playlist?playlistId=" + playlist
    );
    const data = await fetchPlaylist.json();
    setTracks(data);
  };

  useEffect(() => {
    if (playlist) {
      const playlistId = playlist.split("/").pop()?.split("?")[0];
      localStorage.setItem("spotify_playlist_id", playlistId!);
      setPlaylistId(playlistId);
      fetchData();
    }
  }, [playlist]);

  if (!tracks) {
    return (
      <div className="w-full h-[100px] flex items-center justify-center">
        {theme === "dark" ? (
          <PulseLoader color="#ffffff" />
        ) : (
          <PulseLoader color="#000000" />
        )}
      </div>
    );
  }

  return (
    <Card className="border shadow-md p-4 space-y-2">
      <div>Below Songs will be played in pomodoro sessions</div>
      <Button
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        Change Playlist
      </Button>
      <SongsMarquee tracks={tracks} />
      <DialogComponent
        open={dialogOpen}
        setOpen={setDialogOpen}
        changePlaylist={setPlaylist}
      />
    </Card>
  );
}
