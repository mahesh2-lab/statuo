import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// Discover centralized .env in workspace root or current directory
const candidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../../.env"),
  path.resolve(__dirname, "../../.env"),
];

for (const envPath of candidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

// Construct DATABASE_URL if individual PostgreSQL connection params exist
// DATABASE_URL is expected to be provided explicitly (e.g., Neon DB).
// If you need a local fallback, set POSTGRES_* variables and uncomment the block below.
// if (!process.env.DATABASE_URL) {
//   const user = process.env.POSTGRES_USER || "statuo_user";
//   const pass = process.env.POSTGRES_PASSWORD || "2004";
//   const host = process.env.POSTGRES_HOST || "localhost";
//   const port = process.env.POSTGRES_PORT || "5432";
//   const db = process.env.POSTGRES_DB || "statuo_db";
//   process.env.DATABASE_URL = `postgresql://${user}:${pass}@${host}:${port}/${db}`;
// }

// Construct REDIS_URL if individual Redis params exist
if (!process.env.REDIS_URL) {
  const redisHost = process.env.REDIS_HOST || "localhost";
  const redisPort = process.env.REDIS_PORT || "6379";
  process.env.REDIS_URL = `redis://${redisHost}:${redisPort}`;
}

// ── Fail-fast: catch missing required env vars before the app starts ──────────
// On cloud platforms (Render, Railway, Fly.io) the .env file is NOT shipped
// with the image — all secrets must be set as environment variables in the
// platform's dashboard.
const REQUIRED = [
  "DATABASE_URL",
  "REDIS_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[Config:FATAL] Missing required environment variables: ${missing.join(", ")}\n` +
    `Set them in your platform's environment variables dashboard (Render → Environment, Railway → Variables, etc.)`
  );
  process.exit(1);
}
