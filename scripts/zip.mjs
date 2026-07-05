#!/usr/bin/env node
/**
 * Packages the built `dist/` folder into `dist-zip/<name>-<version>.zip` for
 * Chrome Web Store submission. Requires the `zip` CLI to be available.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));

const distDir = resolve(root, "dist");
if (!existsSync(distDir)) {
  console.error("dist/ not found. Run `npm run build` first.");
  process.exit(1);
}

const outDir = resolve(root, "dist-zip");
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, `${pkg.name}-${pkg.version}.zip`);

try {
  execFileSync("zip", ["-r", "-q", outFile, "."], { cwd: distDir });
  console.log(`Created ${outFile}`);
} catch (err) {
  console.error(
    "Failed to create zip. Is the `zip` CLI installed?\n",
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
}
