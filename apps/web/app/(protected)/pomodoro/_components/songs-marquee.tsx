"use client";
import React from "react";
import Marquee from "@repo/ui/components/marquee";
import { Track } from "@lib/types";
import SongCard from "./song-card";
export default function SongsMarquee({ tracks }: { tracks: Track[] }) {
	const duration = tracks.length * 1;
	return (
		<div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-lg bg-background">
			<Marquee pauseOnHover vertical className={`[--duration:${duration}s]`}>
				{tracks.map((track) => (
					<SongCard key={track.id} track={track} />
				))}
			</Marquee>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background"></div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background"></div>
		</div>
	);
}
