import { prismaPostgres } from "@repo/db";

// const globalForPrisma = global as unknown as {
//   prisma: prismaPostgres.PrismaClient;
// };

// export const db = globalForPrisma.prisma || new prismaPostgres.PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const db = prismaPostgres;
