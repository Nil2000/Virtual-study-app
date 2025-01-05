import React from "react";
import VideoSessionNavbar from "../../_components/video-session-navbar";
import VideoSessionContent from "../../_components/video-session-content";
import {
  getRole,
  getRoomName,
  getUserSpecificDetails,
} from "@/actions/roomActions";
import { Role, RoomParticipantRole } from "@repo/db";
import { SessionProvider } from "next-auth/react";
import { auth } from "@lib/auth";

export default async function page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const roomId = (await params).roomId;
  const userInfo = await getUserSpecificDetails(roomId);
  const isAdmin = userInfo.role === RoomParticipantRole.HOST;
  const roomName = await getRoomName(roomId);
  const session = await auth();
  return (
    <div className="min-h-screen flex flex-col">
      <VideoSessionNavbar roomId={roomId} roomName={roomName || ""} />
      <SessionProvider session={session}>
        <VideoSessionContent
          roomId={roomId}
          isAdmin={isAdmin}
          aliasName={userInfo.roomAlisaName || session?.user.name || ""}
        />
      </SessionProvider>
    </div>
  );
}
