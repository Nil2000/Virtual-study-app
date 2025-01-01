import { Track } from "@lib/types";
import { Card } from "@repo/ui/components/card";
import { cn } from "@repo/ui/utils";
import { Music } from "lucide-react";
import React from "react";

export default function SongCard({ track }: { track: Track }) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Card
      className={cn(
        "relative h-24 w-full lg:w-[400px] cursor-pointer overflow-hidden rounded-xl border px-4 flex space-x-2 items-center",
        track ? " hover:bg-gray-100" : "justify-center"
      )}
    >
      {track ? (
        <>
          <Music
            className="h-4 w-4 flex-shrink-0 text-gray-500"
            aria-hidden="true"
          />
          <div className="flex-grow min-w-0">
            <p className="font-medium truncate">{track.name}</p>
            <p className="text-sm text-gray-600 truncate">
              {track.artists.join(", ")} - {track.album}
            </p>
          </div>
          <span className="text-sm text-gray-500 flex-shrink-0">
            {formatDuration(track.duration_ms)}
          </span>
        </>
      ) : (
        <p className="text-gray-500">No song being played</p>
      )}
    </Card>
  );
}
