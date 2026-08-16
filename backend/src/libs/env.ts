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
if (!process.env.DATABASE_URL) {
  const user = process.env.POSTGRES_USER || "statuo_user";
  const pass = process.env.POSTGRES_PASSWORD || "2004";
  const host = process.env.POSTGRES_HOST || "localhost";
  const port = process.env.POSTGRES_PORT || "5432";
  const db = process.env.POSTGRES_DB || "statuo_db";
  process.env.DATABASE_URL = `postgresql://${user}:${pass}@${host}:${port}/${db}`;
}

// Construct REDIS_URL if individual Redis params exist
if (!process.env.REDIS_URL) {
  const redisHost = process.env.REDIS_HOST || "localhost";
  const redisPort = process.env.REDIS_PORT || "6379";
  process.env.REDIS_URL = `redis://${redisHost}:${redisPort}`;
}
