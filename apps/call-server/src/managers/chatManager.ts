import { mongoClient, MongoClientType } from "@repo/db";

export class ChatManager {
  private dbClient: MongoClientType;

  constructor() {
    this.dbClient = mongoClient;
  }

  async createUser(userAuthId: string, avatarUrl: string) {
    try {
      const user = await this.dbClient.user.findUnique({
        where: {
          id: userAuthId,
        },
      });

      if (user) {
        return user;
      }

      const newUser = await this.dbClient.user.create({
        data: {
          userAuthId: userAuthId,
          avatarUrl: avatarUrl,
        },
      });
      return newUser;
    } catch (error) {
      console.log("ERROR in createRoomUser", error);
      return null;
    }
  }

  async createRoom(roomName: string, userId: string, roomId: string) {
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
          name: roomName,
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
        name: room.room.name,
        joinedAt: room.joinedAt,
        leftAt: room.leftAt,
      }));
    } catch (error) {
      console.log("ERROR in getJoinedRooms", error);
      return [];
    }
  }

  async joinRoom(roomId: string, userId: string) {
    try {
      const room = await this.dbClient.room.findUnique({
        where: {
          id: roomId,
        },
      });

      if (!room) {
        return null;
      }

      const user = await this.dbClient.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return null;
      }

      await this.dbClient.room.update({
        where: {
          id: roomId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
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
              name: true,
              role: true,
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
      return [];
    }
  }
}
