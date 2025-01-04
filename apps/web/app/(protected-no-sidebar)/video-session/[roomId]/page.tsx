import React from "react";
import VideoSessionNavbar from "../../_components/video-session-navbar";
import VideoSessionContent from "../../_components/video-session-content";
import { getRole, getRoomName } from "@/actions/roomActions";
import { Role, RoomParticipantRole } from "@repo/db";

export default async function page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;
  const isAdmin = (await getRole(roomId)) === RoomParticipantRole.HOST;
  const roomName = await getRoomName(roomId);

  return (
    <div className="min-h-screen flex flex-col">
      <VideoSessionNavbar roomId={roomId} roomName={roomName || ""} />
      <VideoSessionContent roomId={roomId} isAdmin={isAdmin} />
    </div>
  );
}
