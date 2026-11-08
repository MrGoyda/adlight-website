import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

let prismaInstance: PrismaClient;

if (typeof window === "undefined") {
  const hasStaleDevClient =
    Boolean(globalForPrisma.prisma) &&
    process.env.NODE_ENV !== "production" &&
    !("crmTask" in (globalForPrisma.prisma as unknown as Record<string, unknown>));

  if (!globalForPrisma.prisma || hasStaleDevClient) {
    const pool =
      globalForPrisma.pool ??
      new Pool({
        connectionString: process.env.DATABASE_URL,
        max: process.env.NODE_ENV === "production" ? 10 : 3,
        idleTimeoutMillis: 15000,
        connectionTimeoutMillis: 5000,
      });

    globalForPrisma.pool = pool;

    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }

  prismaInstance = globalForPrisma.prisma;
} else {
  // В браузере (для заглушек Next.js Turbopack) возвращаем пустой PrismaClient
  prismaInstance = null as unknown as PrismaClient;
}

export const prisma = prismaInstance;
