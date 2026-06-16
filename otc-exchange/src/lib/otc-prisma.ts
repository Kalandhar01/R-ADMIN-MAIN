import path from "node:path";
import { readFileSync } from "node:fs";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv, parse as parseDotenv } from "dotenv";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../apps/api/.env"),
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), "../../apps/api/.env"),
  path.resolve(process.cwd(), "apps/api/.env"),
];

function databaseUrlIsConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function loadDatabaseUrlFromEnvFile(envPath: string) {
  loadDotenv({ path: envPath, override: false });
  if (databaseUrlIsConfigured()) return true;

  try {
    const parsed = parseDotenv(readFileSync(envPath));
    const databaseUrl = parsed.DATABASE_URL?.trim();
    if (!databaseUrl) return false;

    process.env.DATABASE_URL = databaseUrl;
    return true;
  } catch {
    return false;
  }
}

if (!databaseUrlIsConfigured()) {
  for (const envPath of envCandidates) {
    if (loadDatabaseUrlFromEnvFile(envPath)) break;
  }
}

const globalForPrisma = globalThis as unknown as {
  otcPrisma?: PrismaClient;
};

function prismaClientOptions(): Prisma.PrismaClientOptions {
  const log: Prisma.LogLevel[] =
    process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) return { log };

  return {
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log,
  };
}

export const prisma =
  globalForPrisma.otcPrisma ||
  new PrismaClient(prismaClientOptions());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.otcPrisma = prisma;
}
