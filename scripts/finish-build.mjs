import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Vercel looks for static output at the project root. Our client build
// outputs to client/dist, so mirror it to a root-level dist/ directory.
const clientDist = resolve(root, "client/dist");
const rootDist = resolve(root, "dist");

if (existsSync(clientDist)) {
  rmSync(rootDist, { recursive: true, force: true });
  cpSync(clientDist, rootDist, { recursive: true });
  console.log("✓ Copied client/dist -> dist for Vercel");
} else {
  console.error("client/dist not found — client build did not produce output");
  process.exit(1);
}