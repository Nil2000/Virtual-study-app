"use client";
import React from "react";
import PomodoroComponent from "./pomodoro";
import Playlist from "./playlist-component";
import Confetti, { ConfettiRef } from "@repo/ui/components/confetti";
import { useSpotify } from "@/hooks/useSpotify";
import SpotifyComponent from "./spotify-component";
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
    stop,
    toggleMute,
    currentPlaylistId,
    vol,
    play,
    start,
  } = useSpotify();

  const confettiRef = React.useRef<ConfettiRef>(null);
  // const playConfetti = () => {
  //   confettiRef.current?.fire();
  // };

  return (
    <div className="font-sans grid md:grid-cols-2 md:grid-rows-1 grid-cols-1 w-full xl:w-[1000px] gap-4 px-3 mx-auto">
      {/* <PomodoroComponent playlistId={playlistId} playConfetti={playConfetti} />
      <Playlist setPlaylistId={setPlaylistId} /> */}
      {/* <Confetti ref={confettiRef} className="z-20" /> */}
      <PomodoroSec
        changeVolume={changeVolume}
        muted={muted}
        start={start}
        pause={pause}
        stop={stop}
        vol={vol}
        toggleMute={toggleMute}
      />
      <SpotifyComponent
        isLoggedIn={isLoggedIn}
        currentPlaying={currentPlaying}
        changePlaylist={changePlaylist}
        generateSpotifyAuthURL={generateSpotifyAuthURL}
        currentPlaylistId={currentPlaylistId}
      />
    </div>
  );
}
