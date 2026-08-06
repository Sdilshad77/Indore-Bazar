import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const clientRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(clientRoot, "..");

// Vercel may resolve the Output Directory relative to the repo root instead
// of the Root Directory (client/). Keep a mirror at the repo root so the
// static output is found no matter which one it uses.
const clientDist = resolve(clientRoot, "dist");
const rootDist = resolve(repoRoot, "dist");

if (existsSync(clientDist)) {
  rmSync(rootDist, { recursive: true, force: true });
  cpSync(clientDist, rootDist, { recursive: true });
  console.log("✓ Mirrored client/dist to repo-root dist for Vercel");
} else {
  console.error("client/dist not found — vite build did not produce output");
  process.exit(1);
}