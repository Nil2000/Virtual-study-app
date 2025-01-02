"use client";
import React from "react";
import Confetti, { ConfettiRef } from "@repo/ui/components/confetti";
import { useSpotify } from "@/hooks/useSpotify";
import SpotifyComponent from "./spotify-component";
import PomodoroSec from "./pomodoro-secondary";

export default function PomodoroPage() {
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
    vol,
    start,
    playListInfo,
  } = useSpotify();
  const confettiRef = React.useRef<ConfettiRef>(null);

  return (
    <div className="relative">
      <div className="font-sans grid md:grid-cols-2 md:grid-rows-1 grid-cols-1 w-full xl:w-[1000px] gap-4 px-3 mx-auto">
        <PomodoroSec
          changeVolume={changeVolume}
          muted={muted}
          start={start}
          pause={pause}
          stop={stop}
          vol={vol}
          toggleMute={toggleMute}
          confettiRef={confettiRef}
        />
        <SpotifyComponent
          isLoggedIn={isLoggedIn}
          currentPlaying={currentPlaying}
          changePlaylist={changePlaylist}
          generateSpotifyAuthURL={generateSpotifyAuthURL}
          playListInfo={playListInfo}
        />
      </div>
      <Confetti ref={confettiRef} className="h-full" />
    </div>
  );
}
