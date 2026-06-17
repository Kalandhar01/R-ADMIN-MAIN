import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env" });

export default defineConfig({
  schema: "packages/db/prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
