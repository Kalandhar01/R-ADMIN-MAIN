import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadDotenv, parse as parseDotenv } from "dotenv";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), ".env.local"),
  path.resolve(process.cwd(), "../apps/api/.env"),
  path.resolve(process.cwd(), "../api/.env"),
  path.resolve(process.cwd(), "../../apps/api/.env"),
  path.resolve(process.cwd(), "apps/api/.env"),
];

function databaseUrlIsConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function loadDatabaseUrlFromEnvFile(envPath: string) {
  if (!existsSync(envPath)) return false;

  loadDotenv({ path: envPath, override: false, quiet: true });
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
  ractyshConstructionPrisma?: PrismaClient;
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
  globalForPrisma.ractyshConstructionPrisma ||
  new PrismaClient(prismaClientOptions());

export function getPrismaClient(): PrismaClient {
  return prisma;
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.ractyshConstructionPrisma = prisma;
}
