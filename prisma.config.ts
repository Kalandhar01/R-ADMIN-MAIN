import { chdir } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const appDir = dirname(fileURLToPath(import.meta.url));
const apiDir = resolve(appDir, "../api");
const dbSchema = resolve(appDir, "../../packages/db/prisma/schema.prisma");

chdir(apiDir);
config({ path: ".env" });

export default defineConfig({
  schema: dbSchema,
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
