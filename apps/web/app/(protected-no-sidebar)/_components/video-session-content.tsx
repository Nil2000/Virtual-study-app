"use client";
import React from "react";
import MediaSettings from "./media-setting";
import ChatComponent from "./chat-component";
import VideoSection from "./video-section";
import { Socket, io } from "socket.io-client";
import { MEDIASOUP_PARAMS } from "@lib/constants";
import * as mediasoupClient from "mediasoup-client";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport } from "mediasoup-client/lib/types";
import { useVideoCall } from "@/hooks/useVideoCall";

export default function VideoSessionContent({
  roomId,
  isAdmin,
  aliasName,
}: {
  roomId: string;
  isAdmin: boolean;
  aliasName: string;
}) {
  const remoteVideoContainerRef = React.useRef<HTMLDivElement | null>(null);
  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const audioContainerRef = React.useRef<HTMLDivElement | null>(null);

  const {
    socket,
    isConnected,
    videoNodeLength,
    chatMessages,
    isChatLoading,
    handleSendMessage,
    isMessgeSent,
    isAudioMuted,
    toggleAudio,
    isVideoEnabled,
    toggleVideo,
  } = useVideoCall({
    roomId,
    isAdmin,
    aliasName,
    localVideoRef,
    serverUrl: process.env.NEXT_PUBLIC_VIDEO_SERVER_URL || "",
    videoContainerRef: remoteVideoContainerRef,
    audioContainerRef: audioContainerRef,
  });

  React.useEffect(() => {
    console.log("videoNodeLength Changed ->", videoNodeLength);
  }, [videoNodeLength]);

  return (
    <div className="w-full px-3 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex w-full h-full ">
        <VideoSection
          remoteVideoRef={remoteVideoContainerRef}
          localVideoRef={localVideoRef}
          videoNodeLength={videoNodeLength + 1}
          audioContainerRef={audioContainerRef}
          isAudioMuted={isAudioMuted}
          toggleAudio={toggleAudio}
          isVideoEnabled={isVideoEnabled}
          toggleVideo={toggleVideo}
        />
        <ChatComponent
          isLoading={isChatLoading}
          chatMessages={chatMessages}
          handleSendMessage={handleSendMessage}
          isMessageSent={isMessgeSent}
        />
      </div>
    </div>
  );
}
