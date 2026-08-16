import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV for GCM
const AUTH_TAG_LENGTH = 16;

/**
 * Derives a 32-byte key from environment secret
 */
function getEncryptionKey(): Buffer {
  const secret =
    process.env.TOKEN_ENCRYPTION_KEY ||
    process.env.BETTER_AUTH_SECRET ||
    "pulse-default-secure-encryption-secret-key-32b!";

  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts sensitive string (e.g. API tokens) using AES-256-GCM
 * Returns: base64 string formatted as: iv:authTag:encryptedContent
 */
export function encryptToken(plainText: string | null | undefined): string | null {
  if (!plainText || plainText.trim() === "") return null;

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
  } catch (error) {
    console.error("[Crypto] Encryption failed:", error);
    return plainText; // Fallback
  }
}

/**
 * Decrypts an encrypted token string. If not in iv:authTag:ciphertext format, returns original.
 */
export function decryptToken(encryptedToken: string | null | undefined): string | null {
  if (!encryptedToken || encryptedToken.trim() === "") return null;

  const parts = encryptedToken.split(":");
  if (parts.length !== 3) {
    // Legacy plaintext token, return as-is
    return encryptedToken;
  }

  try {
    const [ivB64, authTagB64, ciphertextB64] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivB64, "base64");
    const authTag = Buffer.from(authTagB64, "base64");
    const ciphertext = Buffer.from(ciphertextB64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("[Crypto] Decryption failed:", error);
    return null;
  }
}
