import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";

console.log("--> Starting server initialization on Render/Production...");

// 1. Prepare Prisma Schema
try {
  execSync("node scripts/prepare-prisma.js", { stdio: "inherit" });
} catch (e) {
  console.warn("prepare-prisma warning:", e?.message || e);
}

// 2. Generate Prisma Client
try {
  execSync("npx prisma generate", { stdio: "inherit" });
} catch (e) {
  console.warn("prisma generate warning:", e?.message || e);
}

// 3. Ensure dist/index.html and dist/server.cjs exist
const distIndexPath = path.join(process.cwd(), "dist", "index.html");
const serverCjsPath = path.join(process.cwd(), "dist", "server.cjs");

if (!fs.existsSync(distIndexPath) || !fs.existsSync(serverCjsPath)) {
  console.log("--> Building frontend (vite build) and server bundle (esbuild) now...");
  try {
    execSync("npx vite build", { stdio: "inherit" });
  } catch (e) {
    console.warn("vite build warning:", e?.message || e);
  }
  try {
    execSync("npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs", { stdio: "inherit" });
  } catch (e) {
    console.error("esbuild server.ts error:", e?.message || e);
  }
}

// 4. Try pushing DB schema if PostgreSQL is configured
const dbUrl = process.env.PG_DATABASE_URL || process.env.DATABASE_URL || "";
if (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://")) {
  try {
    console.log("--> Syncing Database Schema with Prisma...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
  } catch (e) {
    console.warn("prisma db push warning:", e?.message || e);
  }
}

// 5. Start the server
if (fs.existsSync(serverCjsPath)) {
  console.log("--> Launching bundled production server: node dist/server.cjs");
  const child = spawn("node", ["dist/server.cjs"], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code || 0));
} else {
  console.log("--> Fallback: Launching server directly with tsx server.ts");
  const child = spawn("npx", ["tsx", "server.ts"], { stdio: "inherit" });
  child.on("exit", (code) => process.exit(code || 0));
}
