import "../libs/env";
import dns from "dns";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// ─────────────────────────────────────────────────────────────────────────────
// Node.js 22 Happy Eyeballs fix for Neon PostgreSQL
//
// dns.lookup() on the Neon pooler hostname returns 18 results (9 IPv4 + 9 IPv6
// duplicates). Happy Eyeballs fires a simultaneous TCP SYN to every address,
// which triggers Neon's connection rate limiter and every attempt times out.
//
// Node.js 22's net.createConnection() calls dns.lookup with {all:true}, which
// expects cb(null, [{address, family}]). We intercept this and return a single
// deduplicated IPv4 address object, preventing the connection storm.
// ─────────────────────────────────────────────────────────────────────────────
const _originalLookup = dns.lookup.bind(dns);
const _ipCache = new Map<string, string>();

// @ts-expect-error – we intentionally replace dns.lookup with a compat wrapper
dns.lookup = function patchedLookup(
  hostname: string,
  optionsOrCallback:
    | dns.LookupOptions
    | ((err: NodeJS.ErrnoException | null, address: string, family: number) => void)
    | ((err: NodeJS.ErrnoException | null, addresses: dns.LookupAddress[]) => void),
  callback?:
    | ((err: NodeJS.ErrnoException | null, address: string, family: number) => void)
    | ((err: NodeJS.ErrnoException | null, addresses: dns.LookupAddress[]) => void),
) {
  const options: dns.LookupOptions =
    typeof optionsOrCallback === "function" ? {} : (optionsOrCallback as dns.LookupOptions);
  const cb =
    typeof optionsOrCallback === "function"
      ? (optionsOrCallback as Function)
      : (callback as Function);

  const isAll = (options as dns.LookupAllOptions).all === true;

  const cached = _ipCache.get(hostname);
  if (cached) {
    if (isAll) {
      process.nextTick(cb, null, [{ address: cached, family: 4 }]);
    } else {
      process.nextTick(cb, null, cached, 4);
    }
    return;
  }

  dns.resolve4(hostname, (err, addresses) => {
    if (!err && addresses?.length) {
      const unique = [...new Set(addresses)];
      _ipCache.set(hostname, unique[0]);
      if (isAll) {
        cb(null, [{ address: unique[0], family: 4 }]);
      } else {
        cb(null, unique[0], 4);
      }
    } else {
      // Fall back to original lookup for localhost / non-DNS-resolvable hosts
      _originalLookup(hostname, options, cb as never);
    }
  });
};

const rawUrl = process.env.DATABASE_URL ?? "";
const connectionString = rawUrl.replace(/[&?]channel_binding=[^&]*/g, "");

export const pool = new Pool({
  connectionString,
  // Neon requires TLS. rejectUnauthorized:false is safe for development.
  // For production, set to true and ensure the Neon CA cert is trusted.
  ssl: connectionString ? { rejectUnauthorized: false } : false,
});

export const db = drizzle(pool, { schema });

