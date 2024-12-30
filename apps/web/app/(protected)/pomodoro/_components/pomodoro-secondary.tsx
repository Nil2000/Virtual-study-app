import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import { Pause, Play, RefreshCcw } from "lucide-react";
import React from "react";
import ResetButton from "./reset-component";

export default function PomodoroSec() {
  const [time, setTime] = React.useState(30);
  const [isRunning, setIsRunning] = React.useState(false);
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader className="text-center font-bold text-3xl">Timer</CardHeader>
      <CardDescription className="text-center">
        <h1 className="text-6xl font-mono">{formatTime(time)}</h1>
        <div className="text-center space-x-4 mt-4">
          <Button>
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant={"outline"}>
            <RefreshCcw />
            Reset
          </Button>
        </div>
      </CardDescription>
      <CardFooter />
    </Card>
  );
}
