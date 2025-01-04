"use server";

import { CreateRoomSchema, JoinRoomSchema } from "@/schemas/room";
import { auth } from "@lib/auth";
import { db } from "@lib/db";
import { generateRoomId } from "@lib/room";
import { RoomParticipantRole } from "@repo/db";
import axios from "axios";
import { z } from "zod";

/*
 * Create room
 * @param values
 * @returns {Promise<{error: string}>} | {Promise<{roomId: string}>}
 */
export const createRoom = async (values: z.infer<typeof CreateRoomSchema>) => {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const validateFields = CreateRoomSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid room data" };
  }

  const { roomName, maxPeople } = validateFields.data;

  const roomId = generateRoomId();
  console.log(roomName, maxPeople, roomId, session.user.id);
  try {
    console.log("Creating room");
    await db.room.create({
      data: {
        id: roomId,
        name: roomName,
        maxParticipants: maxPeople,
        owner: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return { roomId };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create room" };
  }
};

/*
 * Join room
 * @param values
 * @param role
 * @returns {Promise<{error: string}>} | {Promise<{message: string}>}
 */
export const joinRoom = async (
  values: z.infer<typeof JoinRoomSchema>,
  role: RoomParticipantRole
) => {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  const validateFields = JoinRoomSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid joining room data" };
  }

  const { roomId, joinAs } = validateFields.data;

  try {
    const room = await db.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        participants: true,
      },
    });

    if (!room) {
      return { error: "Room not found" };
    }

    if (room.isPrivate && room.ownerId !== session?.user.id) {
      return { error: "Room is private. Only requested people can join" };
    }

    if (room.participants.length + 1 > room.maxParticipants!) {
      return { error: "Room is full" };
    }

    const existingParticipant = await db.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: session?.user.id!,
        },
      },
    });

    if (!existingParticipant) {
      await db.roomParticipant.create({
        data: {
          room: {
            connect: {
              id: roomId,
            },
          },
          user: {
            connect: {
              id: session?.user.id,
            },
          },
          role: role,
          name: joinAs,
          joinedAt: new Date(Date.now()),
        },
      });
    } else {
      await db.roomParticipant.update({
        where: {
          roomId_userId: {
            roomId: roomId,
            userId: session?.user.id!,
          },
        },
        data: {
          name: joinAs,
          joinedAt: new Date(Date.now()),
        },
      });
    }

    return {
      message: "Joined room successfully",
    };
  } catch (error) {
    return { error: "Failed to join room" };
  }
};

/*
 * Leave room
 * @param roomId
 * @returns {Promise<{error: string}>} | {Promise<{message: string}>}
 */
export const leaveRoom = async (roomId: string) => {
  const session = await auth();

  if (!session || !session.user) {
    return { error: "Unauthorized" };
  }

  try {
    const participant = await db.roomParticipant.findUnique({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: session?.user.id!,
        },
      },
    });

    if (!participant) {
      return { error: "Participant not found" };
    }

    const duration = (Date.now() - participant.joinedAt.getTime()) / 1000;

    const participantHistory = await db.roomSessionHistory.findUnique({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: session?.user.id!,
        },
      },
    });

    if (!participantHistory) {
      await db.roomSessionHistory.create({
        data: {
          room: {
            connect: {
              id: roomId,
            },
          },
          user: {
            connect: {
              id: session?.user.id,
            },
          },
          duration,
        },
      });
    } else {
      await db.roomSessionHistory.update({
        where: {
          roomId_userId: {
            roomId: roomId,
            userId: session?.user.id!,
          },
        },
        data: {
          duration: duration + participantHistory.duration,
        },
      });
    }

    await db.roomParticipant.delete({
      where: {
        roomId_userId: {
          roomId: roomId,
          userId: session?.user.id!,
        },
      },
    });
    return {
      message: "Left room successfully",
    };
  } catch (error) {
    return { error: "Failed to leave room" };
  }
};

const isRoomFilled = async (roomId: string) => {
  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      participants: true,
    },
  });

  if (!room) {
    return true;
  }

  return room.participants.length + 1 > room.maxParticipants!;
};

/*
 * Get role
 * @param roomId
 * @param userId
 * @returns {Promise<string>}
 */
export const getRole = async (roomId: string) => {
  const session = await auth();

  const participant = await db.roomParticipant.findUnique({
    where: {
      roomId_userId: {
        roomId: roomId,
        userId: session?.user.id!,
      },
    },
  });

  return participant?.role;
};

/*
 * Get room name
 * @param roomId
 * @returns {Promise<string>}
 */
export const getRoomName = async (roomId: string) => {
  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
  });

  return room?.name;
};
