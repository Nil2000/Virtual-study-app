import { PrismaClient as Pc1 } from "@prisma-db-mongo/client";
import { PrismaClient as Pc2 } from "@prisma-db-postgres/client";

export const mongoClient = new Pc1();
export const postgresClient = new Pc2();
