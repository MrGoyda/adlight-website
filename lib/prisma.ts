import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
  });

  const adapter = new PrismaPg(pool);
  
  prismaInstance =
    globalForPrisma.prisma ||
    new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaInstance;
} else {
  // В браузере (для заглушек Next.js Turbopack) возвращаем пустой PrismaClient
  prismaInstance = null as unknown as PrismaClient;
}

export const prisma = prismaInstance;
