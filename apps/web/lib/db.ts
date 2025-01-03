import { postgresClient } from "@repo/db";

// const globalForPrisma = globalThis as unknown as { prisma: postgresClient | undefined };

// export const db = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export const db = postgresClient;
