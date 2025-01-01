import { Track } from "@lib/types";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/utils";
import { Music } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function SongCard({ track }: { track: any }) {
  const [trackName, setTrackName] = React.useState<string | undefined>();
  const [artists, setArtists] = React.useState<string | undefined>();
  const [albumName, setAlbumName] = React.useState<string | undefined>();
  const [duration, setDuration] = React.useState<number | undefined>();
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };
  React.useEffect(() => {
    if (track) {
      setTrackName(track.name);
      setArtists(track.artists.map((artist: any) => artist.name).join(", "));
      setAlbumName(track.album.name);
      setDuration(track.duration_ms);
    }
  }, [track]);

  return (
    <Card
      className={cn(
        "relative h-24 w-full lg:w-[400px] cursor-pointer overflow-hidden rounded-xl border px-4 flex space-x-2 items-center shadow-md",
        track ? " hover:bg-gray-100" : "justify-center"
      )}
    >
      {track ? (
        <>
          {/* <Music
            className="h-4 w-4 flex-shrink-0 text-gray-500"
            aria-hidden="true"
          /> */}
          {track.album.images[0].url ? (
            <Image
              src={track.album.images[0].url}
              width={70}
              height={70}
              alt="Song Image"
              className="rounded-lg shadow-md"
            />
          ) : (
            <Music
              className="h-4 w-4 flex-shrink-0 text-gray-500"
              aria-hidden="true"
            />
          )}
          <div className="flex-grow min-w-0">
            <p className="font-medium truncate">{trackName}</p>
            <p className="text-sm text-gray-600 truncate">
              {artists} - {albumName}
            </p>
          </div>
          <span className="text-sm text-gray-500 flex-shrink-0">
            {formatDuration(duration!)}
          </span>
        </>
      ) : (
        <p className="text-gray-500">No song being played</p>
      )}
    </Card>
  );
}
