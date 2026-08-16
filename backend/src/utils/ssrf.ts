import net from "net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // Cloud Instance Metadata
  "metadata.google.internal",
  "instance-data",
]);

/**
 * Checks if an IP is in a private / local subnet
 */
function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;
    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;
    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;
    // 169.254.0.0/16 (Link Local)
    if (parts[0] === 169 && parts[1] === 254) return true;
    // 0.0.0.0
    if (parts[0] === 0) return true;
  } else if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    // ::1 (Loopback)
    if (normalized === "::1" || normalized === "0:0:0:0:0:0:0:1") return true;
    // fe80::/10 (Link local)
    if (normalized.startsWith("fe80:")) return true;
    // fc00::/7 (Unique local)
    if (normalized.startsWith("fc00:") || normalized.startsWith("fd00:")) return true;
  }
  return false;
}

/**
 * Validates whether a target URL is safe to probe without SSRF risk
 */
export function validateTargetUrl(urlString: string): { valid: boolean; error?: string } {
  try {
    const parsed = new URL(urlString);

    // 1. Strict Protocol Check
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "Only HTTP and HTTPS protocols are allowed" };
    }

    // 2. Disallow Userinfo (e.g. http://user:pass@host)
    if (parsed.username || parsed.password) {
      return { valid: false, error: "URLs containing embedded user credentials are not permitted" };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check if local probing is allowed (development or testing)
    const allowLocal =
      process.env.ALLOW_LOCAL_URLS === "true" ||
      process.env.NODE_ENV !== "production";

    if (allowLocal) {
      return { valid: true };
    }

    // 3. Block Known Cloud Metadata and Local Hostnames
    if (BLOCKED_HOSTNAMES.has(hostname)) {
      return { valid: false, error: `Access to internal host "${hostname}" is restricted` };
    }

    if (
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".localhost")
    ) {
      return { valid: false, error: "Access to internal domain spaces is restricted" };
    }

    // 4. IP Range Verification
    if (net.isIP(hostname)) {
      if (isPrivateIp(hostname)) {
        return { valid: false, error: "Access to private or local network IP addresses is restricted" };
      }
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: err.message || "Invalid URL structure" };
  }
}
