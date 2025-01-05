import { CallRole } from "@repo/db";
import { db as prismaMongo } from "../utils/db";

export class ChatManager {
  private dbClient: typeof prismaMongo;

  constructor() {
    this.dbClient = prismaMongo;
  }

  async createChatUser(userAuthId: string, avatarUrl: string) {
    try {
      const user = await this.dbClient.user.findUnique({
        where: {
          userAuthId: userAuthId,
        },
      });

      if (user) {
        return user;
      }

      const newUser = await this.dbClient.user.create({
        data: {
          userAuthId: userAuthId,
          avatarUrl: avatarUrl ? avatarUrl : "",
        },
      });
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
      const dbRoom = await this.dbClient.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (dbRoom) {
        return dbRoom;
      }
      const room = await this.dbClient.room.create({
        data: {
          id: roomId,
          ownerId: userId,
        },
      });
      return room;
    } catch (error) {
      console.log("ERROR in createRoom", error);
      return null;
    }
  }

  async getJoinedRooms(userAuthId: string) {
    try {
      const dbUser = await this.dbClient.user.findUnique({
        where: {
          userAuthId: userAuthId,
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
      return roomUser.map((room) => ({
        id: room.room.id,
        joinedAt: room.joinedAt,
        leftAt: room.leftAt,
      }));
    } catch (error) {
      console.log("ERROR in getJoinedRooms", error);
      return [];
    }
  }

  async joinRoom(
    roomId: string,
    userId: string,
    role: boolean,
    aliasName: string
  ) {
    console.log("Joining room", roomId, userId, role, aliasName);
    try {
      const room = await this.dbClient.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) {
        await this.createRoom(userId, roomId);
      }

      const user = await this.dbClient.user.findUnique({
        where: {
          userAuthId: userId,
        },
      });

      if (!user) {
        return {
          error: "User not found",
        };
      }

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
      return {
        message: "Room joined successfully",
      };
    } catch (error) {
      console.log("ERROR in joinRoom", error);
      return null;
    }
  }

  async addMessageToRoom(roomId: string, body: string, userId: string) {
    try {
      await this.dbClient.message.create({
        data: {
          message: body,
          roomId: roomId,
          senderId: userId,
          createdAt: new Date(Date.now()),
          type: "TEXT",
        },
      });
    } catch (error) {
      console.log("ERROR in addMessageToRoom", error);
      return null;
    }
  }

  async getMessages(roomId: string) {
    try {
      const messages = await this.dbClient.message.findMany({
        where: {
          roomId: roomId,
        },
        select: {
          message: true,
          sender: {
            select: {
              id: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 25,
      });
      return messages;
    } catch (error) {
      console.log("ERROR in getMessages", error);
      return null;
    }
  }
}
