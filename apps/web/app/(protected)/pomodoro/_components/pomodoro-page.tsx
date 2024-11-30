"use client";
import React from "react";
import PomodoroComponent from "./pomodoro";
import Playlist from "./playlist-component";
import Confetti, { ConfettiRef } from "@repo/ui/components/confetti";

export default function PomodoroPage() {
	// const [shouldPlay, setShouldPlay] = React.useState(false);
	const [playlistId, setPlaylistId] = React.useState<string | undefined>(
		undefined
	);
	const confettiRef = React.useRef<ConfettiRef>(null);
	const playConfetti = () => {
		confettiRef.current?.fire();
	};

	return (
		<div className="font-sans grid md:grid-cols-2 grid-cols-1 w-full gap-4 px-3">
			<PomodoroComponent playlistId={playlistId} playConfetti={playConfetti} />
			<Playlist setPlaylistId={setPlaylistId} />
			<Confetti ref={confettiRef} className="z-20" />
		</div>
	);
}
