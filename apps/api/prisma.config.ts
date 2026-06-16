import "dotenv/config";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: resolve(process.cwd(), "../../packages/db/prisma/schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
