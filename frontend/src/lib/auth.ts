import { betterAuth } from 'better-auth';

declare const process: { env?: Record<string, string | undefined> } | undefined;

export const auth = betterAuth({
  baseURL:
    (typeof process !== 'undefined' && process?.env?.BETTER_AUTH_URL) ||
    'http://localhost:3000',
  secret:
    (typeof process !== 'undefined' && process?.env?.BETTER_AUTH_SECRET) ||
    '9d8f3a1e7b6c5420fedcba9876543210123456789abcdef0123456789abcdef',
  emailAndPassword: {
    enabled: true,
  },
});
