"use client";
import React from "react";
import Confetti, { ConfettiRef } from "@repo/ui/components/confetti";
import { useSpotify } from "@/hooks/useSpotify";
import SpotifyComponent from "./spotify-component";
import PomodoroSec from "./pomodoro-secondary";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import axios from "axios";

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
    isPlaying,
  } = useSpotify();
  const confettiRef = React.useRef<ConfettiRef>(null);
  const [completedPomodoros, setCompletedPomodoros] = React.useState([]);

  const getCompletedPomodoros = async () => {
    try {
      const response = await axios.get("/api/pomodoro");
      if (response.data.length > 0) {
        setCompletedPomodoros(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getCompletedPomodoros();
  }, []);

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
          isPlaying={isPlaying}
        />
      </div>
      <div className="mx-auto w-full xl:w-[1000px] px-2 font-sans mt-4">
        <h2 className="text-xl w-full text-center">
          Recently completed pomodoros
        </h2>
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>SL No</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {completedPomodoros.map((pomodoro, index) => (
              <TableRow key={pomodoro.id}>
                <td>{index + 1}</td>
                <td>{new Date(pomodoro.createdAt).toLocaleString()}</td>
                <td>{pomodoro.duration}</td>
              </TableRow>
            ))
            } */}
          </TableBody>
        </Table>
      </div>
      <Confetti ref={confettiRef} className="h-full" />
    </div>
  );
}
