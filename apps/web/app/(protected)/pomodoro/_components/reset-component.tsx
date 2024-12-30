import { Button } from "@repo/ui/components/button";
import { RotateCcw } from "lucide-react";
import React from "react";

export default function ResetButton({
  resetTimer,
}: {
  resetTimer: () => void;
}) {
  return (
    <Button onClick={resetTimer} variant="outline">
      <RotateCcw className="h-4 w-4" />
      Reset
    </Button>
  );
}
