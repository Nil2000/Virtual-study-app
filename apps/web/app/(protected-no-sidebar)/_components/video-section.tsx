import React, { useRef } from "react";
import MediaSettings from "./media-setting";
import VideoFeed from "./video-feed";
import { useTheme } from "@repo/ui/index";

export default function VideoSection({
  remoteVideoRef,
  localVideoRef,
  videoNodeLength,
  audioContainerRef,
  isAudioMuted,
  toggleAudio,
}: {
  remoteVideoRef: React.MutableRefObject<HTMLDivElement | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  audioContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  videoNodeLength: number;
  isAudioMuted: boolean;
  toggleAudio: () => void;
}) {
  const [isMic, setIsMic] = React.useState(true);
  const [isVideo, setIsVideo] = React.useState(true);
  const [isScreenShare, setIsScreenShare] = React.useState(false);

  const toggleVideo = () => setIsVideo((prev) => !prev);
  const toggleScreenShare = () => setIsScreenShare((prev) => !prev);
  const [calculateGrid, setCalculateGrid] = React.useState("");

  const { theme } = useTheme();

  React.useEffect(() => {
    let res = "";
    const calculateColumns = () => {
      // const numberOfItems = items.length;
      return Math.ceil(Math.sqrt(videoNodeLength)); // Square root logic for grid shape
    };
    // const layoutGrid = () => {
    //   const root = Math.floor(Math.sqrt(videoNodeLength));

    //   switch (root) {
    //     case 1:
    //       return "flex-1";
    //     case 2:
    //       return "grid grid-cols-2";
    //     case 3:
    //     case 4:
    //       return "grid grid-cols-2 grid-rows-2";
    //     case 5:
    //     case 6:
    //       return "grid grid-cols-3 grid-rows-2";
    //     case 7:
    //     case 8:
    //     case 9:
    //       return "grid grid-cols-3 grid-rows-3";
    //     default:
    //       return "grid-cols-4";
    //   }
    // };
    // res = layoutGrid();
    setCalculateGrid(`grid grid-cols-${calculateColumns()}`);
  }, [videoNodeLength]);

  return (
    <div className="w-[70%] flex flex-col h-[90vh]">
      {/* <VideoFeed /> */}
      {/* <div className="flex justify-center items-center flex-1"> */}
      <div
        className={`gap-4 flex flex-wrap justify-center items-center w-full h-full overflow-hidden mx-auto`}
        ref={remoteVideoRef}
      >
        <div
          className={`relative flex-1 max-w-full min-h-0 shadow-lg rounded-lg shrink min-w-[400px]`}
        >
          <video
            id="localVideo"
            autoPlay
            muted
            ref={localVideoRef}
            className="w-full h-full object-cover rounded-md"
          ></video>
        </div>
      </div>
      {/* </div> */}
      <div id="audioContaienr" ref={audioContainerRef}></div>
      <MediaSettings
        isMic={!isAudioMuted}
        isVideo={isVideo}
        isScreenShare={isScreenShare}
        toggleMic={toggleAudio}
        toggleVideo={toggleVideo}
        toggleScreenShare={toggleScreenShare}
      />
    </div>
  );
}
