import { CallRole } from "@repo/db";
import { db as prismaMongo } from "../utils/db";
import { Socket } from "socket.io";
import Redis from "ioredis";

export class ChatManager {
  private dbClient: typeof prismaMongo;
  private rooms: Map<string, Socket[]>;
  private redisClient: Redis;
  private socketMap: Map<string, { roomId: string; userId: string }>;

  constructor() {
    this.dbClient = prismaMongo;
    this.rooms = new Map();
    // this.redisClient = new Redis({
    //   host: process.env.UPSTASH_REDIS_HOST,
    //   port: parseInt(process.env.UPSTASH_REDIS_PORT || "0"),
    //   password: process.env.UPSTASH_REDIS_PASSWORD,
    //   connectTimeout: 10000,
    // });
    this.redisClient = new Redis();
    this.socketMap = new Map();
  }

  async createChatUser(userAuthId: string, avatarUrl: string, socket: Socket) {
    try {
      const cachedUser = await this.redisClient.get(`user:${userAuthId}`);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await this.dbClient.user.findUnique({
        where: {
          id: userAuthId,
        },
      });

      if (user) {
        await this.redisClient.set(
          `user:${userAuthId}`,
          JSON.stringify(user),
          "EX",
          3600
        );
        return user;
      }

      const newUser = await this.dbClient.user.create({
        data: {
          id: userAuthId,
          avatarUrl: avatarUrl ?? "",
        },
      });

      await this.redisClient.set(
        `user:${userAuthId}`,
        JSON.stringify(newUser),
        "EX",
        3600
      );
      return newUser;
    } catch (error) {
      console.log("ERROR in createRoomUser", error);
      return {
        error: error,
      };
    }
  }

  async createRoom(userId: string, roomId: string) {
    try {
      const cachedRoom = await this.redisClient.get(`room:${roomId}`);
      if (cachedRoom) {
        return JSON.parse(cachedRoom);
      }

      const dbRoom = await this.dbClient.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (dbRoom) {
        await this.redisClient.set(
          `room:${roomId}`,
          JSON.stringify(dbRoom),
          "EX",
          3600
        );
        return dbRoom;
      }
      const room = await this.dbClient.room.create({
        data: {
          id: roomId,
          ownerId: userId,
        },
      });
      this.rooms.set(roomId, []);
      if (this.rooms.has(roomId)) {
        console.log("Room created");
      }

      await this.redisClient.set(
        `room:${roomId}`,
        JSON.stringify(room),
        "EX",
        3600
      );
      return room;
    } catch (error) {
      console.log("ERROR in createRoom", error);
      return null;
    }
  }

  async getJoinedRooms(userAuthId: string) {
    try {
      const cachedRooms = await this.redisClient.get(
        `joinedRooms:${userAuthId}`
      );
      if (cachedRooms) {
        return JSON.parse(cachedRooms);
      }

      const dbUser = await this.dbClient.user.findUnique({
        where: {
          id: userAuthId,
        },
      });

      if (!dbUser) {
        return [];
      }

      const roomUser = await this.dbClient.roomUser.findMany({
        where: {
          userId: dbUser.id,
        },
        select: {
          room: true,
          joinedAt: true,
          leftAt: true,
        },
      });

      const joinedRooms = roomUser.map((room) => ({
        id: room.room.id,
        joinedAt: room.joinedAt,
        leftAt: room.leftAt,
      }));

      await this.redisClient.set(
        `joinedRooms:${userAuthId}`,
        JSON.stringify(joinedRooms),
        "EX",
        3600
      );
      return joinedRooms;
    } catch (error) {
      console.log("ERROR in getJoinedRooms", error);
      return [];
    }
  }

  async joinRoom(
    roomId: string,
    userId: string,
    role: boolean,
    aliasName: string,
    socket: Socket
  ) {
    console.log("Joining room", roomId, userId, role, aliasName);
    try {
      const user = await this.dbClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return {
          error: "User not found",
        };
      }
      console.log("User found", user);
      const room = await this.dbClient.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) {
        await this.createRoom(userId, roomId);
      }
      console.log("Room found", room);

      const roomUser = await this.dbClient.roomUser.create({
        data: {
          userId: user.id,
          roomId: roomId,
          role: role ? CallRole.HOST : CallRole.PARTICIPANT,
          joinedAt: new Date(Date.now()),
          name: aliasName,
        },
      });

      await this.dbClient.room.update({
        where: {
          id: roomId,
        },
        data: {
          users: {
            connect: {
              id: roomUser.id,
            },
          },
        },
      });

      if (this.rooms.has(roomId)) {
        console.log("Room already exists");
        this.rooms.get(roomId)?.push(socket);
      } else {
        this.rooms.set(roomId, [socket]);
      }
      this.socketMap.set(socket.id, { roomId, userId: roomUser.id });

      return {
        message: "Room joined successfully",
        roomUserId: roomUser.id,
      };
    } catch (error) {
      console.log("ERROR in joinRoom", error);
      return null;
    }
  }

  async addMessageToRoom(
    roomId: string,
    body: string,
    userId: string,
    type: "TEXT" | "STATUS_TEXT",
    scoket: Socket
  ) {
    try {
      const room = await this.dbClient.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new Error(`Room with ID "${roomId}" does not exist.`);
      }

      const sender = await this.dbClient.roomUser.findUnique({
        where: { id: userId },
      });

      if (!sender) {
        throw new Error(`User with ID "${userId}" is not part of the room.`);
      }

      const message = await this.dbClient.message.create({
        data: {
          message: body,
          roomId: roomId,
          senderId: userId,
          createdAt: new Date(),
          type: type,
        },
        select: {
          id: true,
          message: true,
          type: true,
          createdAt: true,
          sender: {
            select: {
              name: true,
            },
          },
        },
      });

      this.broadCastMessage(roomId, message, scoket.id);
      return { message, error: null };
    } catch (error: any) {
      console.error("ERROR in addMessageToRoom:", error.message);
      return {
        error: error.message,
      };
    }
  }

  async getMessages(roomId: string) {
    try {
      const cachedMessages = await this.redisClient.get(`messages:${roomId}`);
      if (cachedMessages) {
        return JSON.parse(cachedMessages);
      }

      const messages = await this.dbClient.message.findMany({
        where: {
          roomId: roomId,
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          message: true,
          sender: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 25,
      });

      if (messages.length === 0) {
        return [];
      }

      await this.redisClient.set(
        `messages:${roomId}`,
        JSON.stringify(messages),
        "EX",
        3600
      );
      return messages;
    } catch (error) {
      console.log("ERROR in getMessages", error);
      return null;
    }
  }

  async broadCastMessage(roomId: string, message: any, socketId: string) {
    const sockets = this.rooms.get(roomId);
    if (sockets) {
      sockets.forEach((socket) => {
        if (socket.id !== socketId) {
          console.log("Emitting message to", socket.id);
          socket.emit("new-message", message);
        }
      });
    }
  }

  async handleDisconnect(socketId: string) {
    //inform other users in the room
    try {
      // Get user and room information from socket mapping
      const userInfo = this.socketMap.get(socketId);
      if (!userInfo) {
        console.log("No user info found for socket", socketId);
        return;
      }

      const { roomId, userId } = userInfo;

      await this.dbClient.roomUser.update({
        where: {
          id: userId,
        },
        data: {
          leftAt: new Date(),
        },
      });

      const roomUser = await this.dbClient.roomUser.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
        },
      });

      if (roomUser) {
        // Create a status message about user leaving
        // await this.addMessageToRoom(
        //   roomId,
        //   `${roomUser.name} has left the room`,
        //   userId,
        //   "STATUS_TEXT",
        //   { id: socketId } as Socket // Minimal socket mock for broadcast
        // );

        this.broadCastMessage(
          roomId,
          {
            id: Math.random().toString(36),
            message: `${roomUser.name} left`,
            userId: userId,
            type: "STATUS_TEXT",
          },
          socketId
        );
      }

      // Remove socket from rooms map
      const sockets = this.rooms.get(roomId);
      if (sockets) {
        this.rooms.set(
          roomId,
          sockets.filter((socket) => socket.id !== socketId)
        );

        // If room is empty, clean up Redis cache
        if (this.rooms.get(roomId)?.length === 0) {
          await this.redisClient.del(`messages:${roomId}`);
          await this.redisClient.del(`room:${roomId}`);
        }
      }

      // Clean up socket mapping
      this.socketMap.delete(socketId);
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  }
}
