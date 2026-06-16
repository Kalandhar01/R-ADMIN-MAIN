import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function connectPrismaDatabase(): Promise<boolean> {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Consultation workflow will use in-memory records.");
    return false;
  }

  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error("PostgreSQL connection failed. Consultation workflow will use in-memory records.", error);
    return false;
  }
}
