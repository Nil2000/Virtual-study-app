import { CallRole, PrismaClient as Pc1 } from "@prisma-db-mongo/client";
import {
  Role,
  RoomParticipantRole,
  PrismaClient as Pc2,
} from "@prisma-db-postgres/client";

// const globalForPrisma = global as unknown as {
//   prisma_mongo: Pc1;
//   prisma_postgres: Pc2;
// };

// export const prismaMongo = globalForPrisma.prisma_mongo || new Pc1();
// export const prismaPostgres = globalForPrisma.prisma_postgres || new Pc2();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma_mongo = prismaMongo;
//   globalForPrisma.prisma_postgres = prismaPostgres;
// }

// export * as prismaMongo from "@prisma-db-mongo/client";
// export * as prismaPostgres from "@prisma-db-postgres/client";

const prismaMongo = new Pc1();
const prismaPostgres = new Pc2();

export { CallRole, Role, RoomParticipantRole, prismaMongo, prismaPostgres };
