import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Pomodoro_time_options } from "@lib/constants";
export default function SelectTime({
  handleDurationChange,
  disabled,
}: {
  handleDurationChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <Select onValueChange={handleDurationChange} disabled={disabled}>
      <SelectTrigger className="w-[60%]">
        <SelectValue placeholder="Select Pomodoro time setting" />
      </SelectTrigger>
      <SelectContent className="font-sans">
        {Pomodoro_time_options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
