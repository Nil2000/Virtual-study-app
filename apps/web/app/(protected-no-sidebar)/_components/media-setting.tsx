import { Button } from "@repo/ui/components/button";
import {
  Mic,
  MicOff,
  ScreenShare,
  ScreenShareOff,
  Video,
  VideoOff,
} from "lucide-react";
import React from "react";

export default function MediaSettings({
  isMic,
  isVideo,
  isScreenShare,
  toggleMic,
  toggleVideo,
  toggleScreenShare,
}: {
  isMic: boolean;
  isVideo: boolean;
  isScreenShare: boolean;
  toggleMic: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
}) {
  return (
    <div className="h-[3rem] flex space-x-2 justify-center items-center">
      <Button className="rounded-full p-3" onClick={toggleMic}>
        {isMic ? <Mic size={24} /> : <MicOff size={24} />}
      </Button>
      <Button className="rounded-full p-3" onClick={toggleVideo}>
        {isVideo ? <Video size={24} /> : <VideoOff size={24} />}
      </Button>
      <Button className="rounded-full p-3" onClick={toggleScreenShare}>
        {isScreenShare ? (
          <ScreenShare size={24} />
        ) : (
          <ScreenShareOff size={24} />
        )}
      </Button>
    </div>
  );
}
