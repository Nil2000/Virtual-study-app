"use client";
import React from "react";
import PomodoroComponent from "./pomodoro";
import Playlist from "./playlist-component";
import Confetti, { ConfettiRef } from "@repo/ui/components/confetti";
import { useSpotify } from "@/hooks/useSpotify";
import SpotifyComponet from "./spotify-component";
import PomodoroSec from "./pomodoro-secondary";

export default function PomodoroPage() {
  // const [shouldPlay, setShouldPlay] = React.useState(false);
  const [playlistId, setPlaylistId] = React.useState<string | undefined>(
    undefined
  );
  const {
    isLoggedIn,
    currentPlaying,
    changeVolume,
    changePlaylist,
    generateSpotifyAuthURL,
    muted,
    pause,
    play,
    stop,
    toggleMute,
    currentPlaylistId,
  } = useSpotify();

  const confettiRef = React.useRef<ConfettiRef>(null);
  // const playConfetti = () => {
  //   confettiRef.current?.fire();
  // };

  return (
    <div className="font-sans grid md:grid-cols-2 grid-cols-1 w-full gap-4 px-3">
      {/* <PomodoroComponent playlistId={playlistId} playConfetti={playConfetti} />
      <Playlist setPlaylistId={setPlaylistId} /> */}
      {/* <Confetti ref={confettiRef} className="z-20" /> */}
      <SpotifyComponet
        isLoggedIn={isLoggedIn}
        currentPlaying={currentPlaying}
        changeVolume={changeVolume}
        changePlaylist={changePlaylist}
        generateSpotifyAuthURL={generateSpotifyAuthURL}
        muted={muted}
        pause={pause}
        play={play}
        stop={stop}
      />
      <PomodoroSec />
    </div>
  );
}
