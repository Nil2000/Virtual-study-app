import { prismaMongo } from "@repo/db";

const globalForPrisma = global as unknown as {
  prisma: typeof prismaMongo;
};

export const db = globalForPrisma.prisma || prismaMongo;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// export const db = prismaMongo;
