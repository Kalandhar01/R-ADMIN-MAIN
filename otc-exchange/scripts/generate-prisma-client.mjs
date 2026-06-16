import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const appRoot = process.cwd();
const schemaPath = resolve(appRoot, "prisma/schema.prisma");

execFileSync("prisma", ["generate", "--schema", schemaPath], {
  cwd: appRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});
