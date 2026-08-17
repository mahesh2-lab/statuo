import "./env";
import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
  plugins: [
    dash()
  ],
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    ipAddress: {
      // Trust standard reverse-proxy / CDN IP headers so rate limiting uses
      // the real client IP rather than the shared per-path bucket fallback.
      ipAddressHeaders: [
        "x-forwarded-for",
        "cf-connecting-ip",  // Cloudflare
        "x-real-ip",         // Nginx
        "x-client-ip",       // HAProxy / Apache
      ],
      // Mark localhost and the Docker bridge subnet as trusted proxies so
      // Better Auth strips internal IPs and reads the real client address.
      trustedProxies: [
        "127.0.0.1",
        "::1",
        "172.16.0.0/12",  // Docker bridge networks (172.17.x.x – 172.31.x.x)
      ],
    },
  },
});