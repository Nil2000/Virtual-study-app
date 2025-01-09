import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { Pause, Play, RefreshCcw, Volume2, VolumeX } from "lucide-react";
import React from "react";
import ResetButton from "./reset-component";
import { Slider } from "@repo/ui/components/slider";
import SelectTime from "./select-time";
import { useConfettiStore } from "@/hooks/useConfettiStore";
import axios from "axios";

interface PomodoroSecProps {
  changeVolume: any;
  muted: boolean;
  pause: () => void;
  stop: () => void;
  vol: number;
  toggleMute: () => void;
  start: () => void;
  confettiRef: React.RefObject<any>;
}

export default function PomodoroSec({
  changeVolume,
  muted,
  pause,
  stop,
  vol,
  toggleMute,
  start,
  confettiRef,
}: PomodoroSecProps) {
  let intervalId: NodeJS.Timeout | null = null;
  const [isRunning, setIsRunning] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<any>(null);
  const [time, setTime] = React.useState<number>(0);
  const [breakTime, setBreakTime] = React.useState<number>(0);
  const [workTime, setWorkTime] = React.useState<number>(0);
  const confetti = useConfettiStore();
  const handleVolumeChange = (newVolume: number[]) => {
    changeVolume(newVolume[0]);
  };

  const formatTime = (time: number) => {
    const hour = Math.floor(time / 3600);
    const minute = Math.floor((time % 3600) / 60);
    const second = Math.floor(time % 60);
    return `${hour}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    setIsRunning(!isRunning);
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  const breakTimeStart = (time: number, wTime: number, bTime: number) => {
    return time % (wTime + bTime) == bTime;
  };

  const breakTimeEnd = (time: number, wTime: number, bTime: number) => {
    return time % (wTime + bTime) == 0;
  };

  const selectPomodoroTime = (value: string) => {
    // setSelectedTime(true);
    let [hours, wTime, bTime] = value.split(":");
    if (!hours || !bTime || !wTime) {
      return;
    }
    setSelectedTime(new Date(Date.now()).getTime());
    setTime(parseFloat(hours) * 60 * 60);
    setWorkTime(parseFloat(wTime) * 60);
    setBreakTime(parseFloat(bTime) * 60);
  };

  const handleResetTime = () => {
    setTime(0);
    setIsRunning(false);
    stop();
    setSelectedTime(null);
  };

  const playAlarm = () => {
    if (muted) return;

    const audio = new Audio("/clock-alarm.mp3");
    audio.volume = vol / 100;
    audio.play();
  };

  const sessionCompleted = async () => {
    try {
      console.log("Session completed");
      await axios.post("/api/pomodoro", {
        createdTime: selectedTime,
        endTime: new Date(Date.now()).getTime(),
      });
      setSelectedTime(null);
    } catch (error) {
      console.log(error);
    }
  };

  const stopPomodoro = () => {
    console.log("Time is 0");
    playAlarm();
    setIsRunning(false);
    stop();
    // setSelectedTime(false);
    sessionCompleted();
    confetti.onOpen();
    if (intervalId) clearInterval(intervalId);
  };

  React.useEffect(() => {
    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        if (breakTimeStart(time, workTime, breakTime)) {
          playAlarm();
          pause();
        }
        if (breakTimeEnd(time, workTime, breakTime)) {
          playAlarm();
          start();
        }
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      console.log("Isrunning + time is 0");
      stopPomodoro();
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [time, isRunning]);

  React.useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <Card className="border shadow-md p-4 space-y-2 h-full">
      <CardHeader className="text-center font-bold text-3xl">Timer</CardHeader>
      <CardDescription className="flex flex-col gap-4 text-center">
        <h1 className="text-6xl font-mono">{formatTime(time)}</h1>
        {/* {breakTime && <p>Break Time</p>} */}
        <div className="text-center space-x-4">
          <Button onClick={togglePlay} disabled={time === 0}>
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            variant={"outline"}
            onClick={handleResetTime}
            disabled={time === 0}
          >
            <RefreshCcw />
            Reset
          </Button>
        </div>
        <div className="flex justify-center">
          <SelectTime
            handleDurationChange={selectPomodoroTime}
            disabled={isRunning}
          />
        </div>
        <div className="flex space-x-4 justify-center">
          <Slider
            min={0}
            max={100}
            value={[vol]}
            onValueChange={handleVolumeChange}
            className="w-32"
          />
          <Button onClick={toggleMute} variant={"outline"}>
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardDescription>
      <CardFooter />
    </Card>
  );
}
