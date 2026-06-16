import { chdir } from "node:process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const apiDir = resolve(dirname(fileURLToPath(import.meta.url)), "../api");
const dbSchema = resolve(dirname(fileURLToPath(import.meta.url)), "../../packages/db/prisma/schema.prisma");

chdir(apiDir);
config({ path: ".env" });

export default defineConfig({
  schema: dbSchema,
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
